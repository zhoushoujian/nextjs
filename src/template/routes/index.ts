import { Express, Request, Response, Router, NextFunction } from 'express';
import { renderAndCache } from '@/lib/utils';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', (req: Request, res: Response | any) => {
  //put your redux data to res.data to render page
  res.data = {
    common: {
      text: 'put your text here',
    },
  };
  return renderAndCache(req, res, '/', {});
});

// 路由入口
const index = (app: Express) =>
  app.use('/', (req: Request, res: Response, next: NextFunction) => router(req, res, next));

export default index;
