import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体类
import { Cat } from '@/module/cats/entity/cat.entity';

// 控制器和服务
import { CatsController } from '@/module/cats/cats.controller';
import { CatsService } from '@/module/cats/cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cat]), ConfigModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
