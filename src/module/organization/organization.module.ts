import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体类
import { Organization } from './entity/organization.entity';

// 控制器和服务
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), ConfigModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
