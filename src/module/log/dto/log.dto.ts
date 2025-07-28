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

// 单个响应数据
export class LogResponseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  level: string;

  @IsString()
  message: string;

  @IsString()
  meta: string;

  @IsDate()
  timestamp: Date;
}

// 列表响应数据
export class LogsResponseDto {
  @IsNotEmpty()
  @IsInt()
  total: number;

  @IsNotEmpty()
  @IsArray()
  list: LogResponseDto[];
}

// 查询参数
export class QueryLogDto {
  @IsOptional()
  @IsString()
  readonly keyword?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页必须为数字' })
  @Min(1, { message: '分页必须大于1' })
  readonly pageNum?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页条数必须为数字' })
  @Min(1, { message: '分页条数必须大于1' })
  readonly pageSize?: number;
}
