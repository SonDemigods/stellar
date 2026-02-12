import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';
import { Request, Response } from 'express';

import { LoggerConfig } from '@/config/logger.config';

import { LogService } from '@/module/log/log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private readonly logService: LogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    // 修复：显式声明 request 和 response 的类型
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();

    const { path } = request;

    // 过滤特定路径，不记录日志
    const { excludedPaths = [] } = LoggerConfig;
    if (excludedPaths.includes(path)) {
      return next.handle();
    }

    const { method, url, params, query } = request;
    const body: Record<string, any> = request.body as Record<string, any>;

    // 记录请求信息
    this.logger.info(
      {
        type: 'REQUEST',
        method,
        url,
        params,
        query,
        body: method !== 'GET' ? body : undefined,
      },
      `Incoming Request: ${method} ${url}`,
    );

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          // 响应时间
          const endTime = Date.now();
          const duration = endTime - startTime;

          // 响应日志
          const responseLog = {
            type: 'RESPONSE',
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            data:
              typeof data === 'object' && data !== null
                ? data
                : { result: String(data) },
          };

          // 记录响应信息
          this.logger.info(
            responseLog,
            `Outgoing Response: ${method} ${url} ${response.statusCode} - ${duration}ms`,
          );

          // 存储响应日志到数据库
          this.logService
            .create(
              'info',
              `Outgoing Response: ${method} ${url}`,
              JSON.stringify(responseLog),
            )
            .catch((err) => this.logger.error('未能保存响应日志', err));
        },
        error: (error: Error) => {
          // 错误时间
          const endTime = Date.now();
          const duration = endTime - startTime;

          // 错误日志
          const errorLog = {
            type: 'ERROR',
            method,
            url,
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
              status: 500,
              errorTime: endTime,
            },
          };

          // 记录错误信息
          this.logger.error(
            errorLog,
            `Request Error: ${method} ${url} - ${500} - ${duration}ms`,
          );

          // 存储错误日志到数据库
          this.logService
            .create(
              'error',
              `Request Error: ${method} ${url}`,
              JSON.stringify(errorLog),
            )
            .catch((err) => this.logger.error('未能保存错误日志', err));
        },
      }),
    );
  }
}
