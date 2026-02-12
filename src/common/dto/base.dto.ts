import { IsString, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

// 基础数据DTO
export class BaseDto {
  @IsNotEmpty({ message: 'ID不能为空' })
  @IsString({ message: 'ID必须是字符串' })
  id: string;

  @IsNotEmpty({ message: '创建时间不能为空' })
  @IsString({ message: '创建时间必须是字符串' })
  createTime: string;

  @IsNotEmpty({ message: '创建用户ID不能为空' })
  @IsString({ message: '创建用户ID必须是字符串' })
  @IsUUID('4', { message: '创建用户ID必须是UUID格式' })
  createUserId: string;

  @IsNotEmpty({ message: '更新时间不能为空' })
  @IsString({ message: '更新时间必须是字符串' })
  updateTime: string;

  @IsNotEmpty({ message: '更新用户ID不能为空' })
  @IsString({ message: '更新用户ID必须是字符串' })
  @IsUUID('4', { message: '更新用户ID必须是UUID格式' })
  updateUserId: string;
}

// 基础响应DTO
export class ResponseDto {
  @IsNotEmpty({ message: '状态码不能为空' })
  @IsInt({ message: '状态码必须是整数' })
  statusCode: number;

  @IsNotEmpty({ message: '消息不能为空' })
  @IsString({ message: '消息必须是字符串' })
  message: string;

  data?: any;
}
