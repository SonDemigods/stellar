import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ResponseDto } from '@common/dto/response.dto';
import {
  LogResponseDto,
  LogsResponseDto,
  QueryLogDto,
} from '@/module/log/dto/log.dto';

import { Log } from '@/module/log/entity/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  // 分页查询
  async findAll(queryLogDto: QueryLogDto): Promise<LogsResponseDto> {
    const { keyword = '', pageNum = 1, pageSize = 10 } = queryLogDto;
    const res = new LogsResponseDto();
    const [data = [], total = 0] = await this.logRepository.findAndCount({
      where: {
        meta: Like(`%${keyword}%`),
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    res.list = data;
    res.total = total;
    return res;
  }

  // 根据ID查询
  async findOne(id: string): Promise<LogResponseDto | ResponseDto> {
    const log = await this.logRepository.findOneBy({ id });
    if (!log) {
      // 使用标准的NOT_FOUND异常表示资源不存在
      throw new NotFoundException({
        statusCode: 404,
        message: '查询失败，数据不存在',
      });
    }
    return {
      statusCode: 200,
      message: '查询成功',
      data: log,
    };
  }

  // 创建日志
  async createLog(level: string, message: string, meta?: string): Promise<Log> {
    const log = this.logRepository.create({
      id: uuidv4(),
      level,
      message,
      meta: meta || '',
    });
    return this.logRepository.save(log);
  }
}
