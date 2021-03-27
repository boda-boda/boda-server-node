import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: null,
        error: (exception) => {
          if (exception instanceof HttpException && exception.getStatus() < 500) return;

          exception.message = `(${request.careCenter?.id}): ${exception.message}`;
          Sentry.captureException(exception);
        },
      }),
    );
  }
}
