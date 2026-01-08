import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 1. Check if the service returned a custom message
        // This allows you to return { data: [...], message: "Admin created!" }
        const customMessage = data?.message;
        const finalData = data?.data !== undefined ? data.data : data;

        return {
          success: true,
          message: customMessage || 'Operation successful',
          data: finalData,
        };
      }),
    );
  }
}
