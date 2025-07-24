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

import {
  CreateCatDto,
  UpdateCatDto,
  CatResponseDto,
  CatsResponseDto,
  QueryCatDto,
} from './dto/cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly configService: ConfigService,
    private catsService: CatsService,
  ) {}

  @Get()
  async findAll(@Query() queryCatDto: QueryCatDto): Promise<CatsResponseDto> {
    return this.catsService.findAll(queryCatDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CatResponseDto | null> {
    return this.catsService.findOne(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<CatResponseDto> {
    return this.catsService.create(createCatDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto | null> {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.catsService.remove(id);
  }
}
