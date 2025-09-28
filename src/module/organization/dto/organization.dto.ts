import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

// 创建数据传输对象
export class CreateOrganizationDto {
  @IsOptional()
  @IsString()
  organizationCode?: string;

  @IsNotEmpty({ message: '名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '父级id不能为空' })
  @IsString()
  parentId: string;
}

// 更新数据传输对象
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsNotEmpty({ message: 'id不能为空' })
  id: string;
}

// 单个响应数据传输对象
export class OrganizationResponseDto extends CreateOrganizationDto {
  @IsNotEmpty()
  id: string;
}

// 树形结构响应数据传输对象
export class OrganizationTreeResponseDto extends OrganizationResponseDto {
  // 子节点列表
  @IsArray()
  children?: OrganizationResponseDto[];
}

// 列表响应数据传输对象
export class OrganizationListResponseDto {
  @IsArray()
  list: OrganizationResponseDto[];

  @IsNotEmpty()
  total: number;
}

// 查询参数传输对象
export class QueryOrganizationDto {
  @IsOptional()
  @IsString()
  readonly keyword?: string;
}
