import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 记录错误（始终记录）
    this.logger.error(
      `Database query failed: ${exception.message}`,
      exception.stack,
      'PostgreSQL',
    );

    // 安全调试日志（仅非生产环境）
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug('SQL:', exception.query);
      this.logger.debug('Parameters:', exception.parameters);
    }

    // 默认响应
    let statusCode = 500;
    let message = 'Database operation failed';

    // PostgreSQL 使用 SQLSTATE (exception.code)
    const sqlState = exception.code;

    switch (sqlState) {
      case '23505': // unique_violation
        statusCode = 409;
        message = '';
        break;

      case '23503': // foreign_key_violation
        statusCode = 400;
        message = 'Invalid reference: related record not found';
        break;

      case '23514': // check_violation
      case '22001': // string_data_right_truncation
      case '22P02': // invalid_text_representation
        statusCode = 400;
        message = 'Invalid data provided';
        break;

      // 其他客户端错误可继续扩展
      default:
        // 对于未知错误，保持 500，并记录 SQLSTATE 便于排查
        this.logger.warn(`Unhandled PostgreSQL error code: ${sqlState}`);
    }

    const responseBody: any = {
      statusCode,
      message,
    };

    // 开发环境可附加更多细节（不暴露给生产用户）
    if (process?.env?.NODE_ENV === 'development') {
      responseBody.error = exception.message;
      responseBody.sqlState = sqlState;
      responseBody.query = exception.query;
    }

    response.status(statusCode).json(responseBody);
  }
}
