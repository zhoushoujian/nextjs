import * as os from 'os';
import { Request, Response } from 'express';
import client from '@/client';
import logger from '@/lib/logger';

export const getIpFunc = () => {
  //获取ip地址
  let address: string;
  const networks: any = os.networkInterfaces();
  Object.keys(networks).forEach(function (k) {
    for (const kk in networks[k]) {
      if (networks[k][kk].family === 'IPv4' && networks[k][kk].address !== '127.0.0.1') {
        address = networks[k][kk].address;
      }
    }
  });
  //@ts-ignore
  return address;
};

export const getIp = (req: Request, str: string | null) => {
  let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '';
  if ((ip as string).split(',').length > 0) {
    ip = (ip as string).split(',')[0];
  }
  if (str) {
    logger.info(`${str}的访问者ip: `, ip);
  }
  return ip;
};

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
      //@ts-ignore
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

export const checkDataType = (data: string, type: string) => {
  return Object.prototype.toString.call(data) === `[object ${type}]`;
};

export const writeResponse = (req: Request, res: Response, data: any) => {
  if (res) {
    try {
      if (Object.prototype.toString.call(data) !== '[object Object]') {
        logger.error('response data must be an object', data);
        res.status(500).end();
      }
      const wrapper = JSON.stringify({
        status: 'SUCCESS',
        result: { ...req.query, ...req.body, ...data },
      });
      let tmpBuf: any = Buffer.from(wrapper);
      const headers: any = {};
      headers['content-length'] = tmpBuf.length;
      headers['content-type'] = 'application/json';
      res.writeHead(200, headers);
      res.write(tmpBuf);
      res.end();
      tmpBuf = null;
    } catch (e) {
      // Don't leave the client handing
      logger.error('writeResponse e', e.stack || e.toString());
      return reportError(req, res, e);
    }
  }
};

export const reportError = (req: Request, res: Response, err: Error) => {
  try {
    logger.error('reportError url', req.originalUrl, 'err', err);
    // err = "系统错误，请联系管理员";
    const wrapper = JSON.stringify({
      status: 'FAILURE',
      result: {
        errCode: 500,
        errText: err.stack || err.toString(),
      },
    });
    let tmpBuf: any = Buffer.from(wrapper);
    const headers = {
      'content-length': tmpBuf.length,
      'content-type': 'application/json',
    };
    res.writeHead(500, headers);
    res.write(tmpBuf);
    res.end();
    tmpBuf = null;
  } catch (e) {
    // Don't leave client hanging
    res.status(500).end();
    logger.error('reportError e', e.stack || e.toString());
  }
};

export const reportInvokeError = (req: Request, res: Response, errText: string) => {
  try {
    logger.warn('reportInvokeError url', req.originalUrl, 'errText', errText);
    const wrapper = JSON.stringify({
      status: 'FAILURE',
      result: {
        errCode: 400,
        errText,
      },
    });
    let tmpBuf: any = Buffer.from(wrapper);
    const headers = {
      'content-length': tmpBuf.length,
      'content-type': 'application/json',
    };
    res.writeHead(400, headers);
    res.write(tmpBuf);
    res.end();
    tmpBuf = null;
  } catch (e) {
    res.status(500).end();
    logger.error('reportInvokeError e', e.stack || e.toString());
  }
};

export const renderAndCache = async (req: Request, res: Response | any, pagePath: string, queryParams: any) => {
  console.warn('data script size: ', res.data && calcSize(JSON.stringify(res.data).length));
  try {
    const time = Date.now();
    logger.info('======> Generating View with Next');
    const html = await client.renderToHTML(req, res, pagePath, queryParams);
    logger.info('======> Time Taken by Next: ', (Date.now() - time) / 1000, ' 秒');
    res.send(html);
    return;
  } catch (e) {
    logger.error('======> CLIENT.renderToHTML Error', e);
    client.renderError(e, req, res, pagePath, queryParams);
  }
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
