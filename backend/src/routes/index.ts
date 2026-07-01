import express from 'express';
import reviewRouter from './review.routes.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/reviews',
    route: reviewRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
