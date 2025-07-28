import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体类
import { Log } from '@/module/log/entity/log.entity';

// 控制器和服务
import { LogController } from '@/module/log/log.controller';
import { LogService } from '@/module/log/log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log]), ConfigModule],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
