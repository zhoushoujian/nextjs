import { message } from 'antd';

const axiosPendingArr: { u: string; cancel: () => void }[] = [];
export const removePending = (config: { url: string; method: string }) => {
  for (const i in axiosPendingArr) {
    if (axiosPendingArr[i].u === config.url + '&' + config.method) {
      axiosPendingArr[i].cancel();
      axiosPendingArr.splice(Number(i), 1);
    }
  }
};

export const axiosInterceptorsConfig = (axios: any) => {
  let currentDate = Date.now();
  let requestTimes = 0;
  let visitApiMoreTimes = false;
  let visitApiMoreTimesTimer: any = null;
  const CancelToken = axios.CancelToken;
  axios.defaults.timeout = 30000;

  axios.interceptors.request.use(
    function (config) {
      removePending(config);
      config.cancelToken = new CancelToken(c => {
        axiosPendingArr.push({ u: config.url + '&' + config.method, cancel: c });
      });
      requestTimes++;
      if (requestTimes > 50) {
        if (Date.now() - currentDate > 10 * 1000) {
          currentDate = Date.now();
          requestTimes = 0;
        } else {
          console.error('more calls in short time, config', config);
        }
      }
      return config;
    },
    function (err: Error) {
      console.error('axios.interceptors.request err', err);
      return Promise.reject(err);
    },
  );

  axios.interceptors.response.use(
    response => {
      removePending(response.config);
      if (response) {
        return response.data.result;
      } else {
        console.error('axios.interceptors no response', response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('no response');
      }
    },
    error => {
      if (error && error.response) {
        if (!error.response.data) {
          console.error('axios.interceptors.response.use error.response', error.response);
        } else if (!error.response.data.result) {
          console.error('axios.interceptors.response.use error.response.data', error.response.data);
        } else if (error.response.data.result.errText === 'ip blocked') {
          console.error('axios.interceptors.response.use ip blocked');
          if (!visitApiMoreTimes) {
            message.error('您在短时间内访问服务器次数过多，请稍后重试');
            visitApiMoreTimes = true;
            return Promise.reject(error.response.data.result);
          } else {
            clearTimeout(visitApiMoreTimesTimer);
          }
          visitApiMoreTimesTimer = setTimeout(() => {
            visitApiMoreTimes = false;
          }, 2000);
        }
        if (error.response.data) {
          switch (error.response.status) {
            case 401:
              console.error('token已过期');
              return Promise.reject(error.response.data.result);
            default:
              console.error(`error.response.data.result.errCode: ${error.response.data.result.errCode}`);
              break;
          }
        }
      }
      let response: any = {};
      if (error) {
        if (error.response) {
          if (error.response.data) {
            response = error.response.data;
          } else {
            response = error.response;
          }
        } else {
          if (error.toString() === 'Error: Network Error') {
            message.error('请检查网络连接');
            return Promise.reject(error);
          }
          response = error;
        }
      }
      if (error.response) {
        if (error.response.status === 400) {
          message.error(response.result.errText);
        } else if (error.response.status === 500) {
          message.error('系统错误，请联系管理员');
        } else {
          message.error('未知错误');
          console.error('未知错误 response', response);
        }
      }
      return Promise.reject(response); // 返回接口的错误信息
    },
  );
};
