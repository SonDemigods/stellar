import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// 配置模块
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

// 应用模块
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, databaseConfig] }),
    CatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
