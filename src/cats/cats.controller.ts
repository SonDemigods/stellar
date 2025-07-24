import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '@common/dto/response.dto';

import {
  CreateCatDto,
  UpdateCatDto,
  CatResponseDto,
  CatsResponseDto,
  QueryCatDto,
} from '@/cats/dto/cat.dto';
import { CatsService } from '@/cats/cats.service';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly configService: ConfigService,
    private catsService: CatsService,
  ) {}

  @Get()
  async findAll(
    @Query() queryCatDto: QueryCatDto,
  ): Promise<CatsResponseDto | ResponseDto> {
    return this.catsService.findAll(queryCatDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.create(createCatDto);
  }

  @Put()
  async update(
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.update(updateCatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<CatResponseDto | ResponseDto> {
    return this.catsService.remove(id);
  }
}
