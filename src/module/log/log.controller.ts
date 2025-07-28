import { Controller, Get, Query, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ResponseDto } from '@common/dto/response.dto';
import {
  LogResponseDto,
  LogsResponseDto,
  QueryLogDto,
} from '@/module/log/dto/log.dto';

import { LogService } from '@/module/log/log.service';

@Controller('log')
export class LogController {
  constructor(
    private readonly configService: ConfigService,
    private logService: LogService,
  ) {}

  @Get()
  async findAll(
    @Query() queryLogDto: QueryLogDto,
  ): Promise<LogsResponseDto | ResponseDto> {
    return this.logService.findAll(queryLogDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<LogResponseDto | ResponseDto> {
    return this.logService.findOne(id);
  }
}
