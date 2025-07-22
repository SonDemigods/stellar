import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interface/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly configService: ConfigService,
    private catsService: CatsService,
  ) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    const dbHost = this.configService.get<string>('database.host');
    console.log(`Database Host: ${dbHost}`);
    return this.catsService.findAll();
  }
}
