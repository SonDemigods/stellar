import {
  IsString,
  IsInt,
  IsArray,
  IsNotEmpty,
  IsOptional,
  Min,
  IsDate,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// 单个响应数据
export class LogResponseDto {
  @ApiProperty({ example: '1', description: '日志ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ example: 'info', description: '日志级别' })
  @IsString()
  level: string;

  @ApiProperty({ example: '用户登录成功', description: '日志消息' })
  @IsString()
  message: string;

  @ApiProperty({ example: '{"userId":"1"}', description: '元数据' })
  meta: Record<string, any>;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z', description: '创建时间' })
  @IsDate()
  createTime: Date;

  @ApiProperty({ example: '1', description: '创建用户ID' })
  @IsString()
  createUserId: string;
}

// 列表响应数据
export class LogsResponseDto {
  @ApiProperty({ example: 100, description: '总记录数' })
  @IsNotEmpty()
  @IsInt()
  total: number;

  @ApiProperty({ type: [LogResponseDto], description: '日志列表' })
  @IsNotEmpty()
  @IsArray()
  list: LogResponseDto[];
}

// 查询参数
export class QueryLogDto {
  @ApiProperty({ example: '登录', description: '关键词', required: false })
  @IsOptional()
  @IsString()
  readonly keyword?: string;

  @ApiProperty({ example: 1, description: '页码', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页必须为数字' })
  @Min(1, { message: '分页必须大于1' })
  readonly pageNum?: number;

  @ApiProperty({ example: 10, description: '分页条数', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页条数必须为数字' })
  @Min(1, { message: '分页条数必须大于1' })
  readonly pageSize?: number;
}
