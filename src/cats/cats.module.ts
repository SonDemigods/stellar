import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体类
import { Cat } from '@/cats/entity/cat.entity';

// 控制器和服务
import { CatsController } from '@/cats/cats.controller';
import { CatsService } from '@/cats/cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cat]), ConfigModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
