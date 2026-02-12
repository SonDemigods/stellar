import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ResponseDto } from '@/common/dto/base.dto';
import { LogDataDto, LogsPageDataDto, QueryLogDto } from './dto/log.dto';

import { Log } from '@/module/log/entity/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  // 分页查询
  async findAll(
    queryLogDto: QueryLogDto,
  ): Promise<LogsPageDataDto | ResponseDto> {
    const { keyword = '', pageNum = 1, pageSize = 10 } = queryLogDto;
    const res = new LogsPageDataDto();
    const [data = [], total = 0] = await this.logRepository.findAndCount({
      where: {
        meta: Like(`%${keyword}%`),
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    res.list = data;
    res.current = pageNum;
    res.total = total;
    return res;
  }

  // 根据ID查询
  async findOne(id: string): Promise<LogDataDto | null | ResponseDto> {
    const log = await this.logRepository.findOneBy({ id });
    return log;
  }

  // 创建日志
  async create(level: string, message: string, meta?: string): Promise<Log> {
    const log = this.logRepository.create({
      id: uuidv4(),
      level,
      message,
      meta: meta || '',
    });
    return this.logRepository.save(log);
  }
}
