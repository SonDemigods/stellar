import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// 分页查询参数
export class QueryPageDto {
  @ApiProperty({ description: '页码', example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于等于1' })
  pageNum?: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于等于1' })
  pageSize?: number;
}

// 分页数据
export class PageDataDto {
  @ApiProperty({ description: '总数', example: 100 })
  total: number;

  @ApiProperty({ description: '当前分页', example: 1 })
  current: number;

  @ApiProperty({ description: '数据', type: [Object] })
  list?: any[];
}
