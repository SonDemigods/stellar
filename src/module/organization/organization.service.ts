import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ResponseDto } from '@/common/dto/base.dto';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationTreeDataDto,
  OrganizationListDataDto,
  OrganizationDataDto,
  QueryOrganizationDto,
} from './dto/organization.dto';

import { Organization } from './entity/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  private buildTree(
    organizationList: Organization[],
    parentId: string | null,
  ): OrganizationTreeDataDto[] {
    return organizationList
      .filter((organization) => {
        if (parentId === null) {
          // 根节点：parent_id 为 null
          return organization.parentId === null;
        } else {
          // 子节点：parent_id 等于当前 parentId
          return organization.parentId === parentId;
        }
      })
      .map((organization) => ({
        id: organization.id,
        organizationCode: organization.organizationCode,
        name: organization.name,
        parentId: organization.parentId,
        // 递归构建子节点
        children: this.buildTree(organizationList, organization.id),
      }));
  }

  // 树查询
  async findTree(): Promise<OrganizationTreeDataDto[]> {
    const organizationList = await this.organizationRepository.find({
      where: {
        deleteFlag: 0,
      },
    });
    const res = this.buildTree(organizationList, null);

    return res;
  }

  // 列表查询
  async findList(
    queryOrganizationDto: QueryOrganizationDto,
  ): Promise<OrganizationListDataDto | ResponseDto> {
    const { keyword } = queryOrganizationDto;
    const res = new OrganizationListDataDto();
    const [data = [], total = 0] =
      await this.organizationRepository.findAndCount({
        where: {
          deleteFlag: 0,
          name: keyword ? Like(`%${keyword}%`) : undefined,
        },
      });

    res.list = data;
    res.total = total;
    return res;
  }

  // 根据ID查询
  async findOne(id: string): Promise<OrganizationDataDto | ResponseDto> {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '查询失败，可能是数据不存在',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return {
      statusCode: 200,
      message: '查询成功',
      data: organization,
    };
  }

  // 新增
  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDataDto | ResponseDto> {
    const {
      name = '',
      organizationCode = '',
      parentId = '',
    } = createOrganizationDto;
    const organization = new Organization();

    organization.id = uuidv4();
    organization.name = name;
    organization.organizationCode = organizationCode;
    organization.parentId = parentId;

    const createdOrganization =
      await this.organizationRepository.save(organization);

    return {
      statusCode: 201,
      message: '创建成功',
      data: createdOrganization,
    };
  }

  // 更新
  async update(
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationDataDto | ResponseDto> {
    const {
      name = '',
      organizationCode = '',
      parentId = '',
      id = '',
    } = updateOrganizationDto;
    const organization = new Organization();

    organization.id = id;
    organization.name = name;
    organization.organizationCode = organizationCode;
    organization.parentId = parentId;

    const { affected = 0 } = await this.organizationRepository.update(
      id,
      organization,
    );
    if (affected === 0) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '更新失败，可能是数据不存在',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedOrganization = await this.organizationRepository.findOneBy({
      id,
    });
    return {
      statusCode: 200,
      message: '更新成功',
      data: updatedOrganization,
    };
  }

  // 删除
  async remove(id: string): Promise<OrganizationDataDto | ResponseDto> {
    const { affected = 0 } = await this.organizationRepository.delete(id);
    if (affected === 0) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '删除失败，可能是数据不存在',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      statusCode: 200,
      message: '删除成功',
      data: null,
    };
  }
}
