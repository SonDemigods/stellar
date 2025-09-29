import {
  IsString,
  IsInt,
  IsArray,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// 创建数据传输对象
export class CreateCatDto {
  @ApiProperty({ example: '小白', description: '猫咪名称' })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须为字符串' })
  name: string;

  @ApiProperty({ example: 3, description: '猫咪年龄', required: false })
  @IsInt({ message: '年龄必须为数字' })
  age?: number;

  @ApiProperty({
    example: 1,
    description: '性别：1-公猫，2-母猫',
    required: false,
  })
  @IsInt({ message: '性别必须为数字' })
  sex?: number;
}

// 更新数据传输对象
export class UpdateCatDto {
  @ApiProperty({ example: 1, description: '猫咪ID' })
  @IsNotEmpty({ message: 'id不能为空' })
  @IsInt({ message: 'id必须为数字' })
  id: number;

  @ApiProperty({ example: '小白白', description: '猫咪名称', required: false })
  @IsString()
  name?: string;

  @ApiProperty({ example: 4, description: '猫咪年龄', required: false })
  @IsInt({ message: '年龄必须为数字' })
  age?: number;

  @ApiProperty({
    example: 1,
    description: '性别：1-公猫，2-母猫',
    required: false,
  })
  @IsInt({ message: '性别必须为数字' })
  sex?: number;
}

// 单个响应数据
export class CatResponseDto {
  @ApiProperty({ example: 1, description: '猫咪ID' })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: '小白', description: '猫咪名称' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3, description: '猫咪年龄' })
  @IsInt()
  age: number;

  @ApiProperty({ example: 1, description: '性别：1-公猫，2-母猫' })
  @IsInt()
  sex: number;
}

// 列表响应数据
export class CatsResponseDto {
  @ApiProperty({ example: 100, description: '总记录数' })
  @IsNotEmpty()
  @IsInt()
  total: number;

  @ApiProperty({ type: [CatResponseDto], description: '猫咪列表' })
  @IsNotEmpty()
  @IsArray()
  list: CatResponseDto[];
}

// 查询参数
export class QueryCatDto {
  @ApiProperty({
    example: '小',
    description: '猫咪名称关键字',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: 3, description: '猫咪年龄', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly age?: number;

  @ApiProperty({
    example: 1,
    description: '性别：1-公猫，2-母猫',
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly sex?: number;

  @ApiProperty({ example: 1, description: '页码', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页必须为数字' })
  @Min(1, { message: '分页必须大于1' })
  readonly pageNum?: number;

  @ApiProperty({ example: 10, description: '每页条数', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页条数必须为数字' })
  @Min(1, { message: '分页条数必须大于1' })
  readonly pageSize?: number;
}
