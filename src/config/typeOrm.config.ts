import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('database.host', 'localhost'),
      port: this.configService.get<number>('database.port', 3306),
      username: this.configService.get<string>('database.username', 'root'),
      password: this.configService.get<string>('database.password', '123456'),
      database: this.configService.get<string>('database.database', 'stellar'),
      timezone: this.configService.get<string>('database.timezone', '+08:00'),
      autoLoadEntities: true,
      synchronize:
        this.configService.get<string>('app.env', 'development') ===
        'development',
    };
  }
}
