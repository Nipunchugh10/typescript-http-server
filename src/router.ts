import { Request } from './request';
import { Response } from './response';

export type RouteHandler = (req: Request, res: Response) => void;

export class Router {
  private routes: Record<string, RouteHandler> = {};

  add(method: string, path: string, handler: RouteHandler): void {
    const routeKey = `${method.toUpperCase()} ${path}`;
    this.routes[routeKey] = handler;
  }

  get(path: string, handler: RouteHandler): void {
    this.add('GET', path, handler);
  }

  post(path: string, handler: RouteHandler): void {
    this.add('POST', path, handler);
  }

  async handle(req : Request, res: Response): Promise<void> {
    const routeKey = `${req.method} ${req.path}`;
    const handler  = this.routes[routeKey];
    
    if (handler) {
      await handler(req, res);
    } else {
      res.status(404).send('Route not found');
    }
  }
}
