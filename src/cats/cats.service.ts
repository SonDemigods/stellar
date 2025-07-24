import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateCatDto,
  UpdateCatDto,
  CatResponseDto,
  CatsResponseDto,
  QueryCatDto,
} from './dto/cat.dto';
import { Cat } from './entity/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
  ) {}

  // 分页查询
  async findAll(queryCatDto: QueryCatDto): Promise<CatsResponseDto> {
    const {
      name = '',
      age = -1,
      sex = -1,
      pageNum = 1,
      pageSize = 10,
    } = queryCatDto;
    const res = new CatsResponseDto();
    const [data = [], total = 0] = await this.catsRepository.findAndCount({
      where: {
        name: name.length > 0 ? name : undefined,
        age: age > -1 ? age : undefined,
        sex: sex > -1 ? sex : undefined,
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    res.data = data;
    res.total = total;
    return res;
  }

  // 根据ID查询
  async findOne(id: number): Promise<CatResponseDto | null> {
    return await this.catsRepository.findOneBy({ id });
  }

  // 新增
  async create(createCatDto: CreateCatDto): Promise<CatResponseDto> {
    const { name = '', age = 0, sex = 0 } = createCatDto;
    const cat = new Cat();

    cat.name = name;
    cat.age = age;
    cat.sex = sex;

    return this.catsRepository.save(cat);
  }

  // 更新
  async update(
    id: number,
    updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto | null> {
    const { name = '', age = 0, sex = 0 } = updateCatDto;
    const cat = new Cat();

    cat.name = name;
    cat.age = age;
    cat.sex = sex;

    await this.catsRepository.update(id, cat);
    return this.catsRepository.findOneBy({ id });
  }

  // 删除
  async remove(id: number): Promise<any> {
    const { raw = [], affected = 0 } = await this.catsRepository.delete(id);
    if (affected === 0) {
      return { message: 'Cat not found' };
    }

    return raw;
  }
}
