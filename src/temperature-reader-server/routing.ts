import { Router } from 'express';
import path from 'path';

export const getStaticRoutes = (router: Router): Router => {
  router.get('*', (_req, res) => {
    res.sendFile('client.html', { root: path.join(__dirname, '../../public/build') });
  });

  return router;
};
