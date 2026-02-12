import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { QueryPageDto, PageDataDto } from '@common/dto/page.dto';

// 日志基础数据传输对象
class LogBaseDto {
  @ApiProperty({ description: '日志级别', type: String, example: 'info' })
  @IsNotEmpty({ message: '日志级别不能为空' })
  @IsString({ message: '日志级别必须是字符串' })
  level: string;

  @ApiProperty({
    description: '日志消息',
    type: String,
    example: '用户登录成功',
  })
  @IsNotEmpty({ message: '日志消息不能为空' })
  @IsString({ message: '日志消息必须是字符串' })
  message: string;

  @ApiProperty({
    description: '元数据',
    type: String,
    example: '{"userId":"1"}',
  })
  @IsNotEmpty({ message: '元数据不能为空' })
  @IsString({ message: '元数据必须是字符串' })
  meta: string;

  @ApiProperty({
    description: '创建时间',
    type: Date,
    example: '2024-01-01T10:00:00.000Z',
  })
  @IsNotEmpty({ message: '创建时间不能为空' })
  @IsDate({ message: '创建时间必须是日期格式' })
  createTime: Date;

  @ApiProperty({ description: '创建用户ID', type: String, example: '1' })
  // @IsString({ message: '创建用户ID必须是字符串' })
  // @IsNotEmpty({ message: '创建用户ID不能为空' })
  createUserId: string;
}

// 日志数据传输对象
export class LogDataDto extends LogBaseDto {
  @ApiProperty({ description: '日志ID', type: String, example: '1' })
  @IsNotEmpty({ message: '日志ID不能为空' })
  @IsString({ message: '日志ID必须是字符串' })
  @IsUUID(4, { message: '日志ID必须是UUID格式' })
  id: string;
}

// 查询日志参数数据传输对象
export class QueryLogDto extends QueryPageDto {
  @ApiProperty({
    description: '关键词',
    type: String,
    example: '登录',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '关键词必须是字符串' })
  readonly keyword?: string;
}

// 创建日志数据传输对象
export class CreateLogDto extends LogBaseDto {}

// 分页日志数据传输对象
export class LogsPageDataDto extends PageDataDto {
  @ApiProperty({ description: '分页数据', type: PageDataDto })
  @IsOptional()
  declare list?: LogDataDto[];
}
