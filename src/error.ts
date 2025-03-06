export class HttpError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public errorCode?: string
    ) {
      super(message);
      this.name = 'HttpError';
    }
  }
  
  export class ValidationError extends HttpError {
    constructor(message: string) {
      super(400, message, 'VALIDATION_ERROR');
    }
  }
  
  export class NotFoundError extends HttpError {
    constructor(resource: string) {
      super(404, `Resource not found: ${resource}`, 'NOT_FOUND');
    }
  }
  
  export class InternalServerError extends HttpError {
    constructor(message: string = 'Internal server error') {
      super(500, message, 'INTERNAL_SERVER_ERROR');
    }
  }
  