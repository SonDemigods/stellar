import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule, Params } from 'nestjs-pino';
import { loggerOptions } from '@config/logger.config';

// 配置模块
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import { TypeOrmConfigService } from '@/config/typeOrm.config';

// 应用模块
import { LogModule } from '@/module/log/log.module';
import { CatsModule } from '@/module/cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    LoggerModule.forRoot(loggerOptions as Params),
    LogModule,
    CatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
