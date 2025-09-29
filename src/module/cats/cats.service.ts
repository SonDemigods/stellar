import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseDto } from '@common/dto/response.dto';
import {
  CreateCatDto,
  UpdateCatDto,
  CatResponseDto,
  CatsResponseDto,
  QueryCatDto,
} from '@/module/cats/dto/cat.dto';

import { Cat } from '@/module/cats/entity/cat.entity';

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

    res.list = data;
    res.total = total;
    return res;
  }

  // 根据ID查询
  async findOne(id: number): Promise<CatResponseDto | ResponseDto> {
    const cat = await this.catsRepository.findOneBy({ id });
    if (!cat) {
      // 使用标准的NOT_FOUND异常表示资源不存在
      throw new NotFoundException({
        statusCode: 404,
        message: '查询失败，数据不存在',
      });
    }
    return {
      statusCode: 200,
      message: '查询成功',
      data: cat,
    };
  }

  // 新增
  async create(
    createCatDto: CreateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    const { name = '', age = 0, sex = 0 } = createCatDto;
    const cat = new Cat();

    cat.name = name;
    cat.age = age;
    cat.sex = sex;

    const createdCat = await this.catsRepository.save(cat);

    return {
      statusCode: 201,
      message: '创建成功',
      data: createdCat,
    };
  }

  // 更新
  async update(
    updateCatDto: UpdateCatDto,
  ): Promise<CatResponseDto | ResponseDto> {
    const { name = '', age = 0, sex = 0, id = 0 } = updateCatDto;
    const cat = new Cat();

    cat.id = id;
    cat.name = name;
    cat.age = age;
    cat.sex = sex;

    const { affected = 0 } = await this.catsRepository.update(id, cat);
    if (affected === 0) {
      // 使用标准的NOT_FOUND异常表示资源不存在
      throw new NotFoundException({
        statusCode: 404,
        message: '更新失败，数据不存在',
      });
    }
    const updatedCat = await this.catsRepository.findOneBy({ id });
    return {
      statusCode: 200,
      message: '更新成功',
      data: updatedCat,
    };
  }

  // 删除
  async remove(id: number): Promise<CatResponseDto | ResponseDto> {
    const { affected = 0 } = await this.catsRepository.delete(id);
    if (affected === 0) {
      // 使用标准的NOT_FOUND异常表示资源不存在
      throw new NotFoundException({
        statusCode: 404,
        message: '删除失败，数据不存在',
      });
    }

    return {
      statusCode: 200,
      message: '删除成功',
      data: null,
    };
  }
}
