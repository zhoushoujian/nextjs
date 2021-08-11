import { Express, Request, Response, Router, NextFunction } from 'express';
import { reportError, writeResponse } from '@/lib/utils';
import logger from '@/lib/logger';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/api', (req: Request, res: Response | any) => {
  try {
    const string = Math.random().toString(32);
    logger.info('/api get success, string', string);
    return writeResponse(req, res, { response: string });
  } catch (err) {
    logger.error('/api get err', err);
    reportError(req, res, err);
  }
});

// 路由入口
const index = (app: Express) =>
  app.use('/', (req: Request, res: Response, next: NextFunction) => router(req, res, next));

export default index;
