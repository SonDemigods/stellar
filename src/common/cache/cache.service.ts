import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

/**
 * 缓存配置服务类
 * 实现CacheOptionsFactory接口，用于动态创建缓存配置
 * 此服务负责从环境变量中读取缓存配置并构建连接选项
 */
@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    // 缓存类型
    const type = this.configService.get<string>('cache.type', 'redis');
    // 缓存过期时间（秒）
    const ttl = this.configService.get<number>('cache.ttl', 3600);
    // 缓存键前缀
    const keyPrefix = this.configService.get<string>(
      'cache.keyPrefix',
      'galaxy:',
    );

    if (type !== 'redis' && type !== 'memory') {
      throw new Error('仅支持Redis和内存缓存类型');
    }

    // 缓存存储配置
    const stores: Keyv[] = [];
    // Redis缓存配置
    if (type === 'redis') {
      const host = this.configService.get<string>('cache.host', 'localhost');
      const port = this.configService.get<number>('cache.port', 6379);
      const connectionTimeout = this.configService.get<number>(
        'cache.connectionTimeout',
        5000,
      );

      stores.push(
        new Keyv({
          store: new KeyvRedis(`redis://${host}:${port}`, {
            // 批量清除缓存的大小
            clearBatchSize: 100,
            // 是否使用UNLINK命令删除过期键，而不是DEL命令
            useUnlink: true,
            // 是否在命名空间中不影响所有键
            noNamespaceAffectsAll: false,
            // 是否在连接错误时抛出异常
            throwOnConnectError: true,
            // 是否在操作错误时抛出异常
            throwOnErrors: false,
            // 连接超时时间（毫秒）
            connectionTimeout,
          }),
        }),
      );
    }
    // 内存缓存配置
    if (type === 'memory') {
      stores.push(
        new Keyv({
          store: new CacheableMemory({
            // 最大缓存项数
            lruSize: 5000,
          }),
        }),
      );
    }

    return {
      // 默认缓存过期时间（毫秒）
      ttl: ttl * 1000,
      // 缓存命名空间，避免与其他应用冲突
      namespace: keyPrefix,
      // 缓存存储配置
      stores,
    };
  }
}
