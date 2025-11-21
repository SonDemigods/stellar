import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => {
  // 默认使用Redis作为缓存类型
  const type = process.env.CACHE_TYPE || 'redis';

  // 验证缓存类型
  if (type !== 'redis' && type !== 'memory') {
    throw new Error('仅支持Redis和内存缓存类型');
  }

  // 验证Redis必要的环境变量
  if (!process.env.REDIS_HOST) {
    throw new Error('Redis主机地址未配置');
  }

  // Redis连接配置
  const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
    connectionTimeout: process.env.REDIS_TIMEOUT
      ? parseInt(process.env.REDIS_TIMEOUT, 10)
      : 5000,
  };

  // 缓存基础配置
  const ttl = process.env.CACHE_TTL
    ? parseInt(process.env.CACHE_TTL, 10)
    : 3600; // 默认1小时
  const keyPrefix = process.env.CACHE_KEY_PREFIX || 'galaxy:';

  return {
    // 缓存基础配置
    type,
    ttl,
    keyPrefix,

    // Redis连接配置
    ...redisConfig,

    // 缓存策略配置 - 保持多级缓存时间配置，便于业务灵活使用
    strategies: {
      // 短时间缓存策略（秒）- 适用于频繁访问但不常变化的数据
      short: process.env.CACHE_STRATEGY_SHORT
        ? parseInt(process.env.CACHE_STRATEGY_SHORT, 10)
        : 300, // 默认5分钟

      // 中时间缓存策略（秒）- 适用于常规数据
      medium: process.env.CACHE_STRATEGY_MEDIUM
        ? parseInt(process.env.CACHE_STRATEGY_MEDIUM, 10)
        : 3600, // 默认1小时

      // 长时间缓存策略（秒）- 适用于很少变化的数据
      long: process.env.CACHE_STRATEGY_LONG
        ? parseInt(process.env.CACHE_STRATEGY_LONG, 10)
        : 86400, // 默认1天
    },
  };
});
