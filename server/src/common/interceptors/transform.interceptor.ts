import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getCorrelationId } from '../correlation/correlation.storage';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload) => {
        // Retrieve the correlation ID for this successful request
        const correlationId = getCorrelationId();

        // Handle null/undefined payloads
        if (!payload) {
          return {
            success: true,
            message: 'Operation successful',
            data: null,
            correlationId,
          };
        }

        // Check if payload is an object but NOT an array
        const isObject = typeof payload === 'object' && !Array.isArray(payload);

        // Extract message if it exists in the payload, keep the rest
        const { message, ...rest } = isObject ? payload : { message: null };

        return {
          success: true,
          message: message || 'Operation successful',
          // If it was an object, spread the rest. If it was an array/primitive, wrap in 'data'.
          ...(isObject ? rest : { data: payload }),
          correlationId,
        };
      }),
    );
  }
}
