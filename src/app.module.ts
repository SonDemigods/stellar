import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 配置模块
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import { TypeOrmConfigService } from '@/config/typeOrm.config';

// 应用模块
import { CatsModule } from '@/cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
