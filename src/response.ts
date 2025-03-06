import { ServerResponse } from 'http';

export class Response {
  private isSent = false;

  constructor(private res: ServerResponse) {}

  status(code: number): this {
    if (!this.isSent) {
      this.res.statusCode = code;
    }
    return this;
  }

  setHeader(key: string, value: string): this {
    if (!this.isSent) {
      this.res.setHeader(key, value);
    }
    return this;
  }

  send(data: string | Buffer): void {
    if (!this.isSent) {
      this.isSent = true;
      this.res.end(data);
    }
  }

  json(data: object): void {
    if (!this.isSent) {
      this.setHeader('Content-Type', 'application/json');
      this.send(JSON.stringify(data));
    }
  }

  html(content: string): void {
    if (!this.isSent) {
      this.setHeader('Content-Type', 'text/html');
      this.send(content);
    }
  }

  // Add a getter to check if response has been sent
  get sent(): boolean {
    return this.isSent || this.res.writableEnded;
  }
}