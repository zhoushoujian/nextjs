import { useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify, ParseOptions } from 'query-string';

interface Options {
  navigateMode?: 'push' | 'replace';
}
const useUrlState = (initialState, options?: Options, parseConfig?: ParseOptions) => {
  const { navigateMode = 'push' } = options || {};
  const { page } = parseConfig || {};
  const location = useLocation();
  const history = useHistory();

  const [, update] = useState(false);

  const initialStateRef = useRef(typeof initialState === 'function' ? initialState() : initialState || {});

  const queryFromUrl = useMemo(() => {
    return parse(location.search, parseConfig);
  }, [location.search, parseConfig]);

  if (queryFromUrl[page] !== undefined) {
    queryFromUrl.pageIsFromUrl = 'yes';
  } else {
    delete queryFromUrl.pageIsFromUrl;
  }

  const targetQuery = {
    ...initialStateRef.current,
    ...queryFromUrl,
  };

  const setState = s => {
    const newQuery = typeof s === 'function' ? (s as Function)(targetQuery) : s;

    // 1. 如果 setState 后，search 没变化，就需要 update 来触发一次更新。比如 demo1 直接点击 clear，就需要 update 来触发更新。
    // 2. update 和 history 的更新会合并，不会造成多次更新
    update(v => !v);
    const queryFromUrlCopy = JSON.parse(JSON.stringify(queryFromUrl));
    delete queryFromUrlCopy.pageIsFromUrl;
    history[navigateMode]({
      hash: location.hash,
      search: stringify({ ...queryFromUrlCopy, ...newQuery }, { skipEmptyString: true }) || '?',
    });
  };

  return [targetQuery, setState] as const;
};

export default useUrlState;
