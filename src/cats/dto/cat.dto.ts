import {
  IsString,
  IsInt,
  IsArray,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

// 创建数据传输对象
export class CreateCatDto {
  @IsString()
  name?: string;

  @IsInt()
  age?: number;

  @IsInt()
  sex?: number;
}

// 更新数据传输对象
export class UpdateCatDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsString()
  name?: string;

  @IsInt()
  age?: number;

  @IsInt()
  sex?: number;
}

// 单个响应数据
export class CatResponseDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsInt()
  sex: number;
}

// 列表响应数据
export class CatsResponseDto {
  @IsNotEmpty()
  @IsInt()
  total: number;

  @IsNotEmpty()
  @IsArray()
  data: CatResponseDto[];
}

// 查询参数
export class QueryCatDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly age?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly sex?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly pageNum?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly pageSize?: number;
}
