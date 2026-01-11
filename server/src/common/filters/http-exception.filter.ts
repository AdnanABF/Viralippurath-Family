import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { SystemLogService } from '../../system-log/system-log.service';
import { getCorrelationId } from '../correlation/correlation.storage';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly systemLogService: SystemLogService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Retrieve the correlation ID for this request
    const correlationId = getCorrelationId();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || (exceptionResponse as any).error
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    // 1. LOG TO SYSTEM LOG DATABASE
    if (status >= 500 && !(exception instanceof HttpException)) {
      this.logger.error(
        `Unhandled Exception: ${message}`,
        exception instanceof Error ? exception.stack : '',
      );

      await this.systemLogService.log({
        errorCode: 'UNHANDLED_CRASH',
        message:
          exception instanceof Error
            ? exception.message
            : 'Unknown Server Crash',
        stack: exception instanceof Error ? exception.stack : 'No stack',
        path: request.url,
        method: request.method,
        userUuid: (request as any).user?.uuid || 'GUEST',
      });
    }

    // 2. SEND STANDARDIZED JSON TO CLIENT
    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      path: request.url,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}
