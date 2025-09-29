import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from '@config/logger.config';

// 配置模块
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import { TypeOrmConfigService } from '@/config/typeOrm.config';

// 应用模块
import { LogModule } from '@/module/log/log.module';
import { OrganizationModule } from '@/module/organization/organization.module';
import { CatsModule } from '@/module/cats/cats.module';

@Module({
  imports: [
    // 配置 ConfigModule，使其在所有模块中可用，并加载所有配置
    ConfigModule.forRoot({
      // 加载应用配置和数据库配置
      load: [appConfig, databaseConfig],
      // 使配置在所有模块中可用
      isGlobal: true,
      // 指定环境变量文件路径
      envFilePath: '.env',
      // 启用配置缓存以提高性能
      cache: true,
    }),
    // 配置 TypeOrmModule，使用异步配置服务
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    LoggerModule.forRoot(loggerOptions),
    LogModule,
    OrganizationModule,
    CatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
