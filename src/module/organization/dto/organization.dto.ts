import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 创建数据传输对象
export class CreateOrganizationDto {
  @ApiProperty({ example: 'ORG001', description: '组织编码', required: false })
  @IsOptional()
  @IsString()
  organizationCode?: string;

  @ApiProperty({ example: '研发部门', description: '组织名称' })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ example: '0', description: '父级ID，根节点为0' })
  @IsNotEmpty({ message: '父级id不能为空' })
  @IsString()
  parentId: string;
}

// 更新数据传输对象
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @ApiProperty({ example: '1', description: '组织ID' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: string;
}

// 单个响应数据传输对象
export class OrganizationResponseDto extends CreateOrganizationDto {
  @ApiProperty({ example: '1', description: '组织ID' })
  @IsNotEmpty()
  id: string;
}

// 树形结构响应数据传输对象
export class OrganizationTreeResponseDto extends OrganizationResponseDto {
  // 子节点列表
  @ApiProperty({
    type: [OrganizationResponseDto],
    description: '子组织列表',
    required: false,
  })
  @IsArray()
  children?: OrganizationResponseDto[];
}

// 列表响应数据传输对象
export class OrganizationListResponseDto {
  @ApiProperty({ type: [OrganizationResponseDto], description: '组织列表' })
  @IsArray()
  list: OrganizationResponseDto[];

  @ApiProperty({ example: 50, description: '总记录数' })
  @IsNotEmpty()
  total: number;
}

// 查询参数传输对象
export class QueryOrganizationDto {
  @ApiProperty({ example: '研发', description: '搜索关键字', required: false })
  @IsOptional()
  @IsString()
  readonly keyword?: string;
}
