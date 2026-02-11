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
  CreateCatDto,
  UpdateCatDto,
  CatResponseDto,
  CatsResponseDto,
  QueryCatDto,
} from './dto/cat.dto';
import { CatsService } from './cats.service';

@ApiTags('猫咪管理')
@Controller('cats')
export class CatsController {
  constructor(
    private readonly configService: ConfigService,
    private catsService: CatsService,
  ) {}

  @ApiOperation({
    summary: '获取猫咪列表',
    description: '根据条件查询猫咪列表',
  })
  @ApiResponse({ status: 200, type: CatsResponseDto })
  @Get()
  async findAll(
    @Query() queryCatDto: QueryCatDto,
  ): Promise<CatsResponseDto | ResponseDto> {
    return this.catsService.findAll(queryCatDto);
  }

  @ApiOperation({ summary: '获取单个猫咪', description: '根据ID获取猫咪详情' })
  @ApiParam({ name: 'id', description: '猫咪ID' })
  @ApiResponse({ status: 200, type: CatResponseDto })
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.findOne(id);
  }

  @ApiOperation({ summary: '创建猫咪', description: '添加新的猫咪信息' })
  @ApiBody({ type: CreateCatDto })
  @ApiResponse({ status: 200, type: CatResponseDto })
  @Post()
  @HttpCode(200)
  async create(
    @Body() createCatDto: CreateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.create(createCatDto);
  }

  @ApiOperation({ summary: '更新猫咪', description: '更新猫咪信息' })
  @ApiBody({ type: UpdateCatDto })
  @ApiResponse({ status: 200, type: CatResponseDto })
  @Put()
  async update(
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.update(updateCatDto);
  }

  @ApiOperation({ summary: '删除猫咪', description: '根据ID删除猫咪' })
  @ApiParam({ name: 'id', description: '猫咪ID' })
  @ApiResponse({ status: 200, type: CatResponseDto })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.remove(id);
  }
}
