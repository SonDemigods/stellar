import { registerAs } from '@nestjs/config';

export default registerAs('search', () => {
  // 验证必要的环境变量
  if (!process.env.ELASTICSEARCH_NODE) {
    throw new Error('Elasticsearch节点地址未配置');
  }

  // Elasticsearch连接配置
  const connection = {
    // 节点地址
    node: process.env.ELASTICSEARCH_NODE,
    // 连接超时（毫秒）
    requestTimeout: process.env.ELASTICSEARCH_REQUEST_TIMEOUT
      ? parseInt(process.env.ELASTICSEARCH_REQUEST_TIMEOUT, 10)
      : 30000,
    // 最大重试次数
    maxRetries: process.env.ELASTICSEARCH_MAX_RETRIES
      ? parseInt(process.env.ELASTICSEARCH_MAX_RETRIES, 10)
      : 3,
    // 重试延迟（毫秒）
    retryDelay: process.env.ELASTICSEARCH_RETRY_DELAY
      ? parseInt(process.env.ELASTICSEARCH_RETRY_DELAY, 10)
      : 1000,
    // 启用SSL
    ssl:
      process.env.ELASTICSEARCH_SSL === 'true'
        ? {
            rejectUnauthorized:
              process.env.ELASTICSEARCH_SSL_REJECT_UNAUTHORIZED !== 'false',
          }
        : undefined,
    // 连接池配置
    connections: process.env.ELASTICSEARCH_CONNECTIONS
      ? parseInt(process.env.ELASTICSEARCH_CONNECTIONS, 10)
      : 5,
    // 保持活动状态
    keepAlive: process.env.ELASTICSEARCH_KEEP_ALIVE === 'true',
    // 保持活动状态超时（毫秒）
    keepAliveInterval: process.env.ELASTICSEARCH_KEEP_ALIVE_INTERVAL
      ? parseInt(process.env.ELASTICSEARCH_KEEP_ALIVE_INTERVAL, 10)
      : 60000,
  };

  // 添加认证信息（如果有）
  if (process.env.ELASTICSEARCH_USERNAME) {
    connection['auth'] = {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD || '',
    };
  }

  // 索引配置
  const indexes = {};

  // 性能优化配置
  const performance = {
    // 最大分页大小
    maxPageSize: process.env.SEARCH_MAX_PAGE_SIZE
      ? parseInt(process.env.SEARCH_MAX_PAGE_SIZE, 10)
      : 100,
    // 搜索超时（毫秒）
    timeout: process.env.SEARCH_TIMEOUT
      ? parseInt(process.env.SEARCH_TIMEOUT, 10)
      : 5000,
    // 最小搜索关键词长度
    minKeywordLength: process.env.SEARCH_MIN_KEYWORD_LENGTH
      ? parseInt(process.env.SEARCH_MIN_KEYWORD_LENGTH, 10)
      : 2,
    // 批处理大小
    batchSize: process.env.SEARCH_BATCH_SIZE
      ? parseInt(process.env.SEARCH_BATCH_SIZE, 10)
      : 1000,
    // 并行请求数量
    concurrentRequests: process.env.SEARCH_CONCURRENT_REQUESTS
      ? parseInt(process.env.SEARCH_CONCURRENT_REQUESTS, 10)
      : 5,
    // 滚动超时
    scrollTimeout: process.env.SEARCH_SCROLL_TIMEOUT || '1m',
  };

  // 错误处理配置
  const errorHandling = {
    // 重试策略
    retry: {
      enabled: process.env.SEARCH_RETRY_ENABLED !== 'false',
      maxAttempts: process.env.SEARCH_RETRY_MAX_ATTEMPTS
        ? parseInt(process.env.SEARCH_RETRY_MAX_ATTEMPTS, 10)
        : 3,
      delay: process.env.SEARCH_RETRY_DELAY
        ? parseInt(process.env.SEARCH_RETRY_DELAY, 10)
        : 1000,
      backoffFactor: process.env.SEARCH_RETRY_BACKOFF_FACTOR
        ? parseFloat(process.env.SEARCH_RETRY_BACKOFF_FACTOR)
        : 2,
    },
    // 降级策略
    fallback: {
      enabled: process.env.SEARCH_FALLBACK_ENABLED === 'true',
    },
  };

  // 缓存配置
  const cache = {
    // 启用缓存
    enabled: process.env.SEARCH_CACHE_ENABLED !== 'false',
    // 缓存过期时间（秒）
    ttl: process.env.SEARCH_CACHE_TTL
      ? parseInt(process.env.SEARCH_CACHE_TTL, 10)
      : 300,
    // 缓存键前缀
    prefix: process.env.SEARCH_CACHE_PREFIX || 'search:',
    // 最大缓存大小
    maxSize: process.env.SEARCH_CACHE_MAX_SIZE
      ? parseInt(process.env.SEARCH_CACHE_MAX_SIZE, 10)
      : 1000,
  };

  // 高级搜索配置
  const advanced = {
    // 模糊搜索
    fuzzy: {
      enabled: process.env.SEARCH_FUZZY_ENABLED === 'true',
      fuzziness: process.env.SEARCH_FUZZY_FUZZINESS || 'AUTO',
      maxExpansions: process.env.SEARCH_FUZZY_MAX_EXPANSIONS
        ? parseInt(process.env.SEARCH_FUZZY_MAX_EXPANSIONS, 10)
        : 50,
    },
    // 高亮配置
    highlight: {
      enabled: process.env.SEARCH_HIGHLIGHT_ENABLED !== 'false',
      preTag: process.env.SEARCH_HIGHLIGHT_PRE_TAG || '<em>',
      postTag: process.env.SEARCH_HIGHLIGHT_POST_TAG || '</em>',
      fragmentSize: process.env.SEARCH_HIGHLIGHT_FRAGMENT_SIZE
        ? parseInt(process.env.SEARCH_HIGHLIGHT_FRAGMENT_SIZE, 10)
        : 150,
      numberOfFragments: process.env.SEARCH_HIGHLIGHT_NUMBER_OF_FRAGMENTS
        ? parseInt(process.env.SEARCH_HIGHLIGHT_NUMBER_OF_FRAGMENTS, 10)
        : 3,
    },
    // 同义词配置
    synonyms: {
      enabled: process.env.SEARCH_SYNONYMS_ENABLED === 'true',
      synonymPath: process.env.SEARCH_SYNONYM_PATH || 'synonyms.txt',
    },
  };

  return {
    // 连接配置
    connection,
    // 索引配置
    indexes,
    // 性能优化配置
    performance,
    // 错误处理配置
    errorHandling,
    // 缓存配置
    cache,
    // 高级搜索配置
    advanced,
  };
});
