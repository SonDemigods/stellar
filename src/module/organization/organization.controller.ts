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
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '@common/dto/response.dto';

import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationTreeResponseDto,
  OrganizationListResponseDto,
  OrganizationResponseDto,
  QueryOrganizationDto,
} from '@/module/organization/dto/organization.dto';
import { OrganizationService } from '@/module/organization/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly configService: ConfigService,
    private organizationService: OrganizationService,
  ) {}

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

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.findOne(id);
  }

  @Post()
  @HttpCode(200)
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Put()
  async update(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.update(updateOrganizationDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<OrganizationResponseDto | ResponseDto> {
    return this.organizationService.remove(id);
  }
}
