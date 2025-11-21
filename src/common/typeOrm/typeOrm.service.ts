import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

/**
 * TypeORM配置服务类
 * 实现TypeOrmOptionsFactory接口，用于动态创建TypeORM配置
 * 此服务负责从环境变量中读取数据库配置并构建连接选项
 */
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // 从环境变量获取数据库连接基本配置
    // 注意：不提供默认密码以增强安全性，必须通过环境变量配置
    const host = this.configService.get<string>('database.host', 'localhost');
    const port = this.configService.get<number>('database.port', 5432);
    const username = this.configService.get<string>('database.username');
    const password = this.configService.get<string>('database.password');
    const database = this.configService.get<string>('database.database');

    // 验证必需的数据库配置项
    // 在应用启动时强制检查关键配置，避免连接失败导致的潜在问题
    if (!username || !password || !database) {
      throw new Error('数据库配置不完整，请检查环境变量');
    }

    return {
      // 数据库类型设置为PostgreSQL
      type: 'postgres',
      // 数据库服务器主机地址
      host,
      // 数据库服务器端口
      port,
      // 数据库用户名
      username,
      // 数据库密码
      password,
      // 要连接的数据库名称
      database,
      // 自动加载实体: NestJS会自动加载所有使用@Entity()装饰器的实体
      autoLoadEntities: true,
      // 数据库模式同步: 禁用自动同步数据库模式，建议在生产环境中手动管理数据库结构
      synchronize: false,
      // SQL日志记录: 禁用SQL查询日志记录，避免在生产环境中暴露敏感信息
      logging: false,
      // 数据库迁移配置: 目前未配置迁移文件，在生产环境中应使用迁移文件管理数据库结构变更
      migrations: [],
      // 订阅者配置: 用于监听数据库实体的创建、更新和删除事件
      subscribers: [],
      // SSL连接配置: 禁用SSL连接，建议在生产环境中启用并配置有效证书
      ssl: false,
      // 连接池和底层驱动配置
      extra: {
        // 启用连接保活
        keepAlive: true,
        // 空闲连接超时时间: 30秒
        idleTimeoutMillis: 30000,
        // 连接池最大连接数: 控制同时打开的数据库连接数量
        max: 10,
        // 连接超时设置: 连接请求在60秒内未完成将超时
        connectionTimeoutMillis: 60000,
      },
    };
  }
}
