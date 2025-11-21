import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '@common/dto/response.dto';

import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationTreeResponseDto,
  OrganizationListResponseDto,
  OrganizationResponseDto,
  QueryOrganizationDto,
} from './dto/organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('组织管理')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly configService: ConfigService,
    private organizationService: OrganizationService,
  ) {}

  @ApiOperation({
    summary: '获取组织列表或树',
    description: '根据条件查询组织列表，无关键词时返回树形结构',
  })
  @ApiResponse({ status: 200, type: OrganizationListResponseDto })
  @Get()
  async findAll(
    @Query() queryOrganizationDto: QueryOrganizationDto,
  ): Promise<
    OrganizationListResponseDto | OrganizationTreeResponseDto[] | ResponseDto
  > {
    if (queryOrganizationDto.keyword) {
      return this.organizationService.findList(queryOrganizationDto);
    }
    // 如果没有关键词，则返回树形结构
    return this.organizationService.findTree();
  }

  @ApiOperation({ summary: '获取单个组织', description: '根据ID获取组织详情' })
  @ApiParam({ name: 'id', description: '组织ID' })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.findOne(id);
  }

  @ApiOperation({ summary: '创建组织', description: '添加新的组织信息' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  @Post()
  @HttpCode(200)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: '更新组织', description: '更新组织信息' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  @Put()
  async update(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.update(updateOrganizationDto);
  }

  @ApiOperation({ summary: '删除组织', description: '根据ID删除组织' })
  @ApiParam({ name: 'id', description: '组织ID' })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.remove(id);
  }
}
