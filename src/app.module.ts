import { Module } from '@nestjs/common';
// 配置模块
import { ConfigModule } from '@nestjs/config';
// TypeORM 模块
import { TypeOrmModule } from '@nestjs/typeorm';
// 日志模块
import { LoggerModule } from 'nestjs-pino';
// 日志配置
import { loggerOptions } from '@config/logger.config';

// 应用配置
import appConfig from '@/config/app.config';
// 数据库配置
import databaseConfig from '@/config/database.config';
// TypeORM 配置服务
import { TypeOrmConfigService } from '@/common/typeOrm/typeOrm.service';
// 缓存配置
import cacheConfig from '@/config/cache.config';
// 缓存配置服务
import { CacheConfigService } from '@/common/cache/cache.service';
// 查询配置
import searchConfig from '@/config/search.config';
// MinIO配置
import minioConfig from '@/config/minio.config';

// 日志模块
import { LogModule } from '@/module/log/log.module';
// 缓存模块
import { CacheModule } from '@nestjs/cache-manager';
// 搜索模块
import { SearchModule } from '@/common/search/search.module';
// 附件模块
import { AttachmentModule } from '@/module/attachment/attachment.module';
// 组织机构模块
import { OrganizationModule } from '@/module/organization/organization.module';
// 用户模块
import { UserModule } from '@/module/user/user.module';

@Module({
  imports: [
    // 配置 ConfigModule，使其在所有模块中可用，并加载所有配置
    ConfigModule.forRoot({
      // 加载应用配置、数据库配置、缓存配置、搜索配置、MinIO配置
      load: [appConfig, databaseConfig, cacheConfig, searchConfig, minioConfig],
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
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    SearchModule,
    AttachmentModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
