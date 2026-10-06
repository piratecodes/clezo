import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    } else if (exception instanceof Error) {
      // Secure fallback: Do not leak internal stack traces or Prisma schema paths
      message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : exception.message;
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else {
      // Ignore routine 401 auth checks. Our frontend handles these gracefully via silent refresh token rotation.
      // Logging them as warnings clutters the console unnecessarily.
      const isRoutineAuthCheck = status === 401;
      
      if (!isRoutineAuthCheck) {
        this.logger.warn(`${request.method} ${request.url} - ${status} ${message}`);
      }
    }

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
