export const formatDate = (fmt: string, timestamp?: number) => {
  let self = new Date();
  if (timestamp) {
    self = new Date(timestamp);
  }
  const o = {
    'M+': self.getMonth() + 1, //月份
    'd+': self.getDate(), //日
    'h+': self.getHours(), //小时
    'm+': self.getMinutes(), //分
    's+': self.getSeconds(), //秒
    'q+': Math.floor((self.getMonth() + 3) / 3), //季度
    S: self.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (self.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

export const calcSize = (size: number) => {
  let formatSize = '';
  if (!size) return '未知';
  if (typeof size !== 'number') {
    return String(size);
  }
  if (size > 1073741824) {
    formatSize = (size / 1024 / 1024 / 1024).toFixed(2) + 'G';
  } else if (size > 1048576) {
    formatSize = (size / 1024 / 1024).toFixed(2) + 'M';
  } else if (size > 1024) {
    formatSize = (size / 1024).toFixed(0) + 'K';
  } else if (size < 1024) {
    formatSize = size + 'B';
  }
  return formatSize;
};

export const isEmptyObj = (obj: any) => {
  if (Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length) {
    return false;
  } else {
    return true;
  }
};

export const formatUrl = function (url: string, ...args: Array<number | string | any>) {
  if (!args.length) {
    return url;
  }
  const arg: string = typeof args[0];
  const target: any = arg === 'string' || arg === 'number' ? args : args[0];
  for (const i in target) {
    if (Object.prototype.hasOwnProperty.call(target, i)) {
      const replace = target[i] !== undefined ? target[i] : '';
      url = url.replace(RegExp('\\{' + i + '\\}', 'gi'), replace);
    }
  }
  return url;
};
