import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { ResponseDto } from '@common/dto/response.dto';
import {
  LogResponseDto,
  LogsResponseDto,
  QueryLogDto,
} from '@/module/log/dto/log.dto';

import { LogService } from '@/module/log/log.service';

@ApiTags('日志管理')
@Controller('log')
export class LogController {
  constructor(
    private readonly configService: ConfigService,
    private logService: LogService,
  ) {}

  @ApiOperation({
    summary: '获取日志列表',
    description: '根据条件查询日志列表',
  })
  @ApiResponse({ status: 200, type: LogsResponseDto })
  @Get()
  async findAll(
    @Query() queryLogDto: QueryLogDto,
  ): Promise<LogsResponseDto | ResponseDto> {
    return this.logService.findAll(queryLogDto);
  }

  @ApiOperation({ summary: '获取单个日志', description: '根据ID获取日志详情' })
  @ApiParam({ name: 'id', description: '日志ID' })
  @ApiResponse({ status: 200, type: LogResponseDto })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<LogResponseDto | ResponseDto> {
    return this.logService.findOne(id);
  }
}
