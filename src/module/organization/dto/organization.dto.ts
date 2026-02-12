import {
  IsString,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// 组织机构基础数据传输对象
class OrganizationBaseDto {
  @ApiProperty({
    description: '组织编码',
    type: String,
    example: 'ORG001',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '组织编码必须是字符串' })
  organizationCode?: string;

  @ApiProperty({
    description: '组织名称',
    type: String,
    example: '研发部门',
  })
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString({ message: '名称必须是字符串' })
  name: string;

  @ApiProperty({
    description: '父级ID，根节点为0',
    type: String,
    example: '0',
  })
  @IsNotEmpty({ message: '父级id不能为空' })
  @IsString()
  parentId: string;
}

// 组织机构数据传输对象
export class OrganizationDataDto extends OrganizationBaseDto {
  @ApiProperty({
    description: '组织ID',
    type: String,
    example: '1',
  })
  @IsNotEmpty({ message: 'id不能为空' })
  @IsString({ message: 'id必须是字符串' })
  id: string;
}

// 查询组织机构参数数据传输对象
export class QueryOrganizationDto {
  @ApiProperty({
    description: '搜索关键字',
    type: String,
    example: '研发',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '搜索关键字必须是字符串' })
  readonly keyword?: string;
}

// 创建组织机构数据传输对象
export class CreateOrganizationDto extends OrganizationBaseDto {}

// 更新组织机构数据传输对象
export class UpdateOrganizationDto extends OrganizationDataDto {}

// 树形结构组织机构数据传输对象
export class OrganizationTreeDataDto extends OrganizationDataDto {
  // 子节点列表
  @ApiProperty({
    description: '子组织列表',
    type: [OrganizationTreeDataDto],
    example: [
      {
        id: '2',
        organizationCode: 'DEV001',
        name: '开发部门',
        parentId: '1',
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: '子组织列表必须是数组' })
  children?: OrganizationDataDto[];
}

// 列表组织机构数据传输对象
export class OrganizationListDataDto {
  @ApiProperty({
    description: '组织列表',
    type: [OrganizationDataDto],
    example: [
      {
        id: '1',
        organizationCode: 'ORG001',
        name: '研发部门',
        parentId: '0',
      },
    ],
  })
  @IsArray({ message: '组织列表必须是数组' })
  list: OrganizationDataDto[];

  @ApiProperty({ description: '总数', type: Number, example: 10 })
  @IsNotEmpty({ message: '总数不能为空' })
  @IsNumber({}, { message: '总数必须是数字' })
  total: number;
}
