import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

import { ResponseDto } from '@common/dto/response.dto';

// 定义响应数据接口
interface ResponseData<T> {
  statusCode: number;
  message: string;
  data?: T;
}

// 类型守卫函数
function isResponseData<T>(data: any): data is ResponseData<T> {
  return (data &&
    typeof data === 'object' &&
    'statusCode' in data &&
    'message' in data) as boolean;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto> {
    return next.handle().pipe(
      map((data: T) => {
        // 获取响应对象
        const response: Response = context.switchToHttp().getResponse();

        // 默认响应状态码和消息
        let statusCode: number = 200;
        let message: string = '请求成功';
        let payload: T = data;

        // 检查是否为标准响应数据格式
        if (isResponseData<T>(data)) {
          statusCode = data.statusCode;
          message = data.message;
          payload = data.data !== undefined ? data.data : data;
        }

        // 设置 HTTP 状态码
        response.statusCode = statusCode;

        // 创建响应数据对象
        const responseDto = new ResponseDto();

        // 设置响应数据
        responseDto.statusCode = statusCode;
        responseDto.message = message;
        responseDto.data = payload;

        // 返回响应数据对象
        return responseDto;
      }),
    );
  }
}
