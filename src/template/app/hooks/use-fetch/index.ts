/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState, useCallback, useRef } from 'react';
import { isEmptyObj } from '@/utils/common';

type IRequestConfig = {
  id?: string; //请求id
  method?: string; //请求方法
  responseType?: string; //返回数据类型，默认为json
  timeout?: number; //请求超时时间，默认为一分钟
  url?: string; //请求地址
  headers?: any; //自定义请求头，默认的请求头已在拦截器定义
  cancelToken?: any; //用于取消请求，一般不用传
  params?: any; //post或put请求的参数
  waitForStart?: boolean; //用于事件调用的标记位
  onSuccess?: (data: any) => void; //请求成功的回调
  onError?: (error: any) => void; //请求失败的回调
  onFinally?: () => void; //不管请求成功与否都会走的回调
  enabled?: boolean; //是否启用请求的标记位
  rest?: {
    url?: string; //自定义url，如果这里有值，则不使用外层的url
    //自定义批量请求url，如果这里有值，则不使用外层的批量请求url
    parallel?: { url?: string; method: string; params?: any; privilegeUrl?: string }[];
  };
};
interface IStart {
  id?: string;
  method?: string;
  url?: string;
  params?: any;
  onSuccess?: (D) => void;
  onError?: (E) => void;
  onFinally?: () => void;
  rest?: {
    url?: string;
    parallel?: { url?: string; method: string; params?: any; privilegeUrl?: string }[];
  };
}
const initStartParams = {
  id: '',
  method: '',
  url: '',
  params: {},
  onSuccess: undefined,
  onError: undefined,
  onFinally: undefined,
  rest: {},
};

const HEADERS = {};
const useFetch = ({
  id,
  method,
  url = '',
  params,
  waitForStart = false,
  onSuccess,
  onError,
  onFinally,
  enabled = true,
  rest = {},
  responseType = 'json',
  timeout = 60000,
  headers = HEADERS,
  cancelToken,
}: IRequestConfig) => {
  const self = useRef({} as any);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(Date.now());
  const [notNeedRequest, setNotNeedRequest] = useState(!!waitForStart);
  const [startParams, setStartParams] = useState<IStart>(initStartParams);
  if (startParams.id) id = startParams.id;
  if (startParams.method) method = startParams.method;
  if (startParams.url) url = startParams.url;
  if (!isEmptyObj(startParams.params)) params = startParams.params;
  if (startParams.onSuccess) onSuccess = startParams.onSuccess;
  if (startParams.onError) onError = startParams.onError;
  if (startParams.onFinally) onFinally = startParams.onFinally;
  //@ts-ignore
  if (!isEmptyObj(startParams.rest)) rest = startParams.rest;

  let cancel: null | Function = null;
  const CancelToken = window.axios?.CancelToken;
  if (CancelToken) {
    cancelToken = new CancelToken(c => {
      cancel = c;
    });
  }
  if (!id && method && url) id = `${method} - ${url}`;
  if (id && !self.current[id]) self.current[id] = { id, cancel };

  useEffect(() => {
    if (!notNeedRequest && enabled) {
      if (method && (url || rest.url || rest.parallel)) {
        if ((url || rest.url) && !rest.parallel) {
          setIsFetching(true);
          if (rest.url) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            url = rest.url;
          }
          //@ts-ignore
          window
            .axios({
              method,
              responseType,
              timeout,
              url,
              headers,
              cancelToken,
              data: params,
            })
            .then(data => {
              if (onSuccess) {
                onSuccess(data);
              } else {
                //@ts-ignore
                setData(data);
                setIsFetching(false); //这里的刷新逻辑不要放到finally，因为放到finally会导致额外的刷新
                setStartParams(initStartParams);
              }
            })
            .catch(err => {
              if (onError) {
                onError(err);
              } else {
                setError(err);
                setIsFetching(false); //这里的刷新逻辑不要放到finally，因为放到finally会导致额外的刷新
                setStartParams(initStartParams);
              }
            })
            .finally(() => {
              onFinally && onFinally();
              delete self.current[id as string];
            });
        } else if (rest.parallel && rest.parallel.length) {
          setIsFetching(true);
          window.axios
            .all(
              rest.parallel.map(item => {
                const { url, method, params, privilegeUrl } = item;
                //@ts-ignore
                return window.axios({
                  method,
                  // eslint-disable-next-line no-nested-ternary
                  url: privilegeUrl ? privilegeUrl : url,
                  params,
                  responseType,
                  timeout,
                  headers,
                  cancelToken,
                });
              }),
            )
            .then(arrayData => {
              //@ts-ignore
              setData(arrayData);
              onSuccess && onSuccess(arrayData);
            })
            .catch(err => {
              if (onError) {
                onError(err);
              } else {
                setError(err);
                setIsFetching(false);
                setStartParams(initStartParams);
              }
            })
            .finally(() => {
              onFinally && onFinally();
              delete self.current[id as string];
            });
        } else {
          console.error('useFetch: 请检查请求地址');
        }
      } else {
        console.log('check method, url or rest.url, please');
        setStartParams(initStartParams);
      }
    } else {
      // console.log("!notNeedRequest && enabled");
      setStartParams(initStartParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notNeedRequest, refresh, enabled]);

  useEffect(() => {
    return () => {
      // console.log('cancel, self.current', self.current);
      for (const i in self.current) {
        if (Object.prototype.hasOwnProperty.call(self.current, i)) {
          self.current[i].cancel && self.current[i].cancel();
        }
      }
      self.current = {};
    };
  }, []);

  const forceUpdate = useCallback(() => {
    setRefresh(Date.now());
  }, []);

  const start = useCallback(
    ({ method = 'get', url = '', params = {}, onSuccess, onError, onFinally, rest = {} }: IStart) => {
      setStartParams({ url, params, method, onSuccess, onError, onFinally, rest });
      setNotNeedRequest(false);
      if (!notNeedRequest) {
        forceUpdate(); //setNotNeedRequest设置值有可能导致不更新，需要强制刷新
      }
    },
    [forceUpdate, notNeedRequest],
  );

  return { data, isFetching, error, start, forceUpdate };
};

export default useFetch;
