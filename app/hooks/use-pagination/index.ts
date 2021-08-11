/* eslint-disable @typescript-eslint/no-empty-function */
import { useCallback, useState, useRef } from 'react';
import { useRouter } from '@/hooks/use-router';
import useFetch from '@/hooks/use-fetch';
import { formatUrl } from '@/utils/common';
import useUrlState from '@/hooks/use-url-state';

export interface IPageParams {
  page: number;
  pageSize: number;
  kw?: string;
}

interface IOptions {
  getRecords?: (data: any) => any[];
  getTotal?: (data: any) => number;
  initialParam?: any;
  enabled?: boolean;
  firstPageToQuery?: 0 | 1; //一般接口查询的页码是从0开始查询的，这里支持页码从1开始查询
}

//requestUrl示例值：/audiences/confs?page={page}&pageSize={pageSize}
//因为服务端的页码是从0开始的，但是表格页码是从一开始的，需要做适配，主要测试场景：切换页码、从第二页分享链接，在第二页搜索关键词，在第二页改变每页显示数量
export default function usePagination(requestUrl: string, options?: IOptions) {
  //推荐使用下面的三个字段，同时也支持接收其他的字段别名，比如有的项目里pageSize叫limit
  let page = 'page',
    pageSize = 'pageSize',
    searchValue = 'searchValue';
  if (
    options &&
    options.initialParam &&
    options.initialParam.paramNames &&
    options.initialParam.paramNames[0] !== undefined
  ) {
    const array = options.initialParam.paramNames;
    page = array[0];
    if (array[1] !== undefined) {
      pageSize = array[1];
      if (array[2] !== undefined) {
        searchValue = array[2];
      }
    }
    delete options.initialParam.paramNames;
  }
  const realOptions: IOptions = {
    getRecords: data => data.items,
    getTotal: data => data.total,
    initialParam: { page: 0, pageSize: 10, searchValue: '' },
    enabled: true,
    ...options,
  };
  const { getRecords, getTotal, initialParam, enabled } = realOptions;
  const [param, setParam] = useUrlState(initialParam, undefined, { page });
  if (!requestUrl.includes(searchValue) && param[searchValue]) {
    requestUrl += `&${searchValue}={${searchValue}}`;
  }
  const self = useRef({ debounceTimer: 0 as any, records: [] as string[] });
  const { push } = useRouter();
  const [timestamp, setTimestamp] = useState(Date.now());
  const url = formatUrl(requestUrl, { timestamp, ...param });
  const { data, isFetching, forceUpdate } = useFetch({
    method: 'get',
    url,
    enabled,
  });
  let total = 0;
  if (data && getTotal && getRecords) {
    total = getTotal(data);
    self.current.records = getRecords(data);
  }

  const pagination = {
    current: Number(param[page]),
    total,
    defaultPageSize: Number(param[pageSize]),
    onChange: pageNumber => {
      setParam({ [page]: pageNumber });
      forceUpdate();
    },
    onShowSizeChange: (__c, pageSizeValue) => {
      setParam({
        [pageSize]: pageSizeValue,
        [page]: 1,
      });
      forceUpdate();
    },
  };

  const navTo = useCallback(
    url => {
      push({ pathname: url, state: param });
    },
    [param, push],
  );

  const onSearch = useCallback(
    searchValueString => {
      setParam({
        [searchValue]: searchValueString,
        [page]: 1,
      });
      if (self.current.debounceTimer) {
        clearTimeout(self.current.debounceTimer);
        self.current.debounceTimer = setTimeout(() => {
          forceUpdate();
          self.current.debounceTimer = 0;
        }, 300);
      } else {
        self.current.debounceTimer = setTimeout(() => {
          forceUpdate();
        }, 300);
      }
    },
    [setParam, page, searchValue, forceUpdate],
  );

  const refresh = useCallback(() => {
    setTimestamp(Date.now());
    forceUpdate();
  }, [forceUpdate]);

  return {
    navTo,
    onSearch,
    refresh,
    isFetching,
    data,
    pagination,
    records: self.current.records,
    param,
  };
}
