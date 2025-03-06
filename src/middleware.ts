import { Request } from './request';
import { Response } from './response';

export type Middleware = (req: Request, res: Response, next: () => Promise<void>) => Promise<void>;

export class MiddlewareStack {
    private middlewares: Middleware[] = [];

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    async run(req: Request, res: Response): Promise<void> {
        let index = -1;

        const next = async (): Promise<void> => {
            index++;
            if (index < this.middlewares.length) {
                await this.middlewares[index](req, res, next);
            }
        };

        await next();
    }
}