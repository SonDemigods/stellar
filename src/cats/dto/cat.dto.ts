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
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须为字符串' })
  name: string;

  @IsInt({ message: '年龄必须为数字' })
  age?: number;

  @IsInt({ message: '性别必须为数字' })
  sex?: number;
}

// 更新数据传输对象
export class UpdateCatDto {
  @IsNotEmpty({ message: 'id不能为空' })
  @IsInt({ message: 'id必须为数字' })
  id: number;

  @IsString()
  name?: string;

  @IsInt({ message: '年龄必须为数字' })
  age?: number;

  @IsInt({ message: '性别必须为数字' })
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
  @IsInt({ message: '分页必须为数字' })
  @Min(1, { message: '分页必须大于1' })
  readonly pageNum?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '分页条数必须为数字' })
  @Min(1, { message: '分页条数必须大于1' })
  readonly pageSize?: number;
}
