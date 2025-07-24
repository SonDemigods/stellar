import {
  IsString,
  IsInt,
  IsArray,
  IsNumberString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

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

  @IsOptional()
  @IsNumberString()
  readonly age?: number;

  @IsOptional()
  @IsNumberString()
  readonly sex?: number;

  @IsOptional()
  @IsNumberString()
  readonly pageNum?: number;

  @IsOptional()
  @IsNumberString()
  readonly pageSize?: number;
}
