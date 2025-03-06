// server.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ServerConfig, DEFAULT_CONFIG }                  from './config';
import { Request }                                       from './request';
import { Response }                                      from './response';
import { Router, RouteHandler }                          from './router';
import { MiddlewareStack, Middleware }                   from './middleware'; // Import Middleware
import { serveStatic }                                   from './static';

export class HttpServer {
    private config     : ServerConfig;
    private router     = new Router();
    private middleware = new MiddlewareStack();

    constructor(config: Partial<ServerConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    public getConfig(): ServerConfig {
        return this.config;
    }
    use(middleware: Middleware): void {
        this.middleware.use(middleware);
    }

    get(path: string, handler: RouteHandler): void {
        this.router.get(path, handler);
    }

    post(path: string, handler: RouteHandler): void {
        this.router.post(path, handler);
    }

    start(): void {
        const server       = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            const request  = new Request(req);
            const response = new Response(res);

            try {
                await this.middleware.run(request, response);
                
                if (!response.sent) {
                    await this.router.handle(request, response);
                }
            } catch (error) {
                if (!response.sent) {
                    response.status(500).send('Internal Server Error');
                }
            }
        });

        server.listen(this.config.port, () => {
            console.log(`Server running at http://${this.config.host}:${this.config.port}`);
        });
    }
}