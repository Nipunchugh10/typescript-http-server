import { IncomingMessage } from 'http';

export class Request {
  readonly method : string;
  readonly url    : string;
  readonly headers: Record<string, string>;
  readonly body   : Promise<Buffer>;

  constructor(req: IncomingMessage) {
    this.method  = req.method?.toUpperCase() || 'GET';
    this.url     = req.url || '/';
    this.headers = req.headers as Record<string, string>;
    
    this.body = new Promise((resolve) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  get path(): string {
    return new URL(this.url, `http://${this.headers.host || 'localhost'}`).pathname;
  }

  get queryParams(): Record<string, string> {
    const searchParams = new URLSearchParams(
      new URL(this.url, `http://${this.headers.host || 'localhost'}`).search
    );
    return Object.fromEntries(searchParams.entries());
  }
}
