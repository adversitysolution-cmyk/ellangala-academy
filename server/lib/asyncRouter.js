import { Router } from 'express';

// Wraps every route handler so a rejected promise (e.g. a MySQL error) reaches
// Express's error middleware instead of hanging the request.
export function asyncRouter() {
  const router = Router();
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const original = router[method].bind(router);
    router[method] = (path, ...handlers) => original(
      path,
      ...handlers.map(h => (req, res, next) => Promise.resolve(h(req, res, next)).catch(next))
    );
  }
  return router;
}
