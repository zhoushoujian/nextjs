import express from 'express';
import * as path from 'path';
import checkDependenceVersion from '@shuyun-ep-team/specified-package-version-check';
import * as uuid from 'uuid';
import client from '@/client';
import logger from '@/lib/logger';
import { formatDate, writeResponse, reportError, getIp, getIpFunc } from '@/lib/utils';
import routes from '@/routes/index';
import apis from '@/apis/index';

const port = process.env.PORT || 5000;
const handle = client.getRequestHandler();

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

client
  .prepare()
  .then(() => {
    return checkDependenceVersion({
      dependenceArr: ['@shuyun-ep-team/eslint-config', 'beauty-logger'],
      ignoreCheck: IS_PRODUCTION,
      onlyWarn: IS_PRODUCTION,
      useDepCheck: true,
      autoFixOutdateDep: true,
    });
  })
  .then(() => {
    const server = express();

    server.all('*', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
      (req as any).id = uuid.v4();
      if (req.url === '/img/favicon.ico' || req.url === '/favicon.ico') {
        return res.end();
      }
      logger.info(`server 收到客户端的请求数量: ${req.url} - ${req.method} - ${getIp(req, '')}`);
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, authorization, Content-Length, Accept, X-Requested-With',
      );
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Expose-Headers', 'Authorization');
      next();
    });

    server.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
      req.method === 'OPTIONS' ? res.status(204).end() : next();
    });

    // heart beat
    server.get('/heart_beat', async (req: express.Request, res: express.Response) => {
      logger.info('heartBeat success', formatDate('yyyy-MM-dd hh:mm:ss'));
      const responseObj = {
        date: formatDate('yyyy-MM-dd hh:mm:ss'),
      };
      return writeResponse(req, res, responseObj);
    });

    server.use('/static', (req: express.Request, res: express.Response) => {
      try {
        logger.info('staticDownload req.url', req.url);
        const filePath = path.join(__dirname, './static' + req.url);
        logger.info('staticDownload filePath', filePath);
        // 支持B/S端跨域问题
        res.type('application/x-javascript');
        res.set({ 'X-Content-Type-Options': 'nosniff' });
        return res.download(filePath);
      } catch (err) {
        logger.error('staticDownload 下载出错', err.stack || err.toString());
        return reportError(req, res, err);
      }
    });

    // route
    routes(server);

    //apis
    apis(server);

    process.on('uncaughtException', err => {
      logger.error('uncaughtException', err.stack || err.toString());
    });

    process.on('unhandledRejection', (error: Error) => {
      logger.error('unhandledRejection', error.stack || error.toString());
    });

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      logger.info(`> Ready on http://${getIpFunc()}:${port}`);
    });
  })
  .catch((err: Error) => {
    logger.error('client.prepare err', err.stack || err.toString());
  });
