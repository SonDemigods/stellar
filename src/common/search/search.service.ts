import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService {
  private readonly client: Client;
  private readonly logger = new Logger(SearchService.name);

  constructor(private configService: ConfigService) {
    // 初始化Elasticsearch客户端
    const searchConfig = this.configService.get('search');

    this.client = new Client({
      node: searchConfig.connection.node,
      requestTimeout: searchConfig.connection.requestTimeout,
      maxRetries: searchConfig.connection.maxRetries,
      auth: searchConfig.connection.auth,
    });

    // 测试连接
    this.testConnection().catch((error) => {
      this.logger.error('Failed to connect to Elasticsearch', error);
    });

    // 初始化索引
    this.initializeIndexes().catch((error) => {
      this.logger.error('Failed to initialize indexes', error);
    });
  }

  /**
   * 测试Elasticsearch连接
   */
  private async testConnection(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('Elasticsearch connection established');
    } catch (error) {
      this.logger.error('Elasticsearch ping failed', error);
      throw error;
    }
  }

  /**
   * 初始化索引
   */
  private async initializeIndexes(): Promise<void> {
    const searchConfig = this.configService.get('search');

    for (const [indexKey, indexConfig] of Object.entries(
      searchConfig.indexes,
    )) {
      const config = indexConfig as any;
      if (config.enabled) {
        try {
          await this.createIndexIfNotExists(indexKey);
        } catch (error) {
          this.logger.error(`Failed to initialize index ${indexKey}`, error);
        }
      }
    }
  }

  /**
   * 创建索引（如果不存在）
   */
  private async createIndexIfNotExists(indexKey: string): Promise<void> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];
    const indexName = `${indexConfig.alias}-${new Date().toISOString().slice(0, 10)}`;

    // 检查别名是否存在
    const aliasExists = await this.client.indices.existsAlias({
      name: indexConfig.alias,
    });

    if (!aliasExists) {
      // 检查索引是否存在
      const indexExists = await this.client.indices.exists({
        index: indexName,
      });

      if (!indexExists) {
        // 创建索引
        await this.client.indices.create({
          index: indexName,
          settings: indexConfig.settings,
          mappings: indexConfig.mappings,
        });

        // 创建别名
        await this.client.indices.putAlias({
          index: indexName,
          name: indexConfig.alias,
        });

        this.logger.log(
          `Created index ${indexName} with alias ${indexConfig.alias}`,
        );
      }
    }
  }

  /**
   * 索引单个文档
   */
  async indexDocument(
    indexKey: string,
    id: string | number,
    document: any,
  ): Promise<void> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return;
    }

    try {
      await this.client.index({
        index: indexConfig.alias,
        id: id.toString(),
        document,
        refresh:
          indexConfig.settings.refresh_interval === '1s' ? 'true' : undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to index document in ${indexKey}`, error);
      throw error;
    }
  }

  /**
   * 批量索引文档
   */
  async bulkIndex(
    indexKey: string,
    documents: Array<{ id: string | number; data: any }>,
  ): Promise<void> {
    if (documents.length === 0) return;

    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return;
    }

    const body = documents.flatMap((doc) => [
      { index: { _index: indexConfig.alias, _id: doc.id.toString() } },
      doc.data,
    ]);

    try {
      await this.client.bulk({
        body,
        refresh:
          indexConfig.settings.refresh_interval === '1s' ? 'true' : undefined,
      });
    } catch (error) {
      this.logger.error(`Bulk index failed for ${indexKey}`, error);
      throw error;
    }
  }

  /**
   * 删除文档
   */
  async deleteDocument(indexKey: string, id: string | number): Promise<void> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return;
    }

    try {
      await this.client.delete({
        index: indexConfig.alias,
        id: id.toString(),
        refresh:
          indexConfig.settings.refresh_interval === '1s' ? 'true' : undefined,
      });
    } catch (error) {
      this.logger.error(`Failed to delete document from ${indexKey}`, error);
      throw error;
    }
  }

  /**
   * 搜索文档
   */
  async search(
    indexKey: string,
    keyword: string,
    options: {
      page?: number;
      pageSize?: number;
      fields?: string[];
      highlight?: boolean;
      filters?: any;
      sort?: any[];
    } = {},
  ): Promise<{ hits: any[]; total: number }> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return { hits: [], total: 0 };
    }

    const page = options.page || 1;
    const pageSize = Math.min(
      options.pageSize || 10,
      searchConfig.performance.maxPageSize,
    );
    const from = (page - 1) * pageSize;

    // 构建查询
    const query = this.buildQuery(
      keyword,
      indexKey,
      options.fields,
      options.filters,
    );

    // 构建搜索请求
    const searchRequest: any = {
      index: indexConfig.alias,
      from,
      size: pageSize,
      query,
      sort: options.sort || [{ _score: { order: 'desc' } }],
      timeout: `${searchConfig.performance.timeout}ms`,
    };

    // 添加高亮
    if (options.highlight && searchConfig.advanced.highlight.enabled) {
      searchRequest.highlight = this.buildHighlight(indexKey, options.fields);
    }

    try {
      const response = await this.client.search(searchRequest);

      const result = {
        hits: response.hits.hits.map((hit: any) => ({
          ...(hit._source || {}),
          highlight: hit.highlight,
        })),
        total:
          typeof response.hits.total === 'number'
            ? response.hits.total
            : response.hits.total?.value || 0,
      };

      return result;
    } catch (error) {
      this.logger.error(`Search failed in ${indexKey}`, error);

      // 如果启用了降级策略，可以返回空结果或从其他数据源获取
      if (searchConfig.errorHandling.fallback.enabled) {
        this.logger.warn(`Falling back to empty results for ${indexKey}`);
        return { hits: [], total: 0 };
      }

      throw error;
    }
  }

  /**
   * 构建查询
   */
  private buildQuery(
    keyword: string,
    indexKey: string,
    fields?: string[],
    filters?: any,
  ): any {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    const query: any = {
      bool: {
        must: [],
        filter: filters || [],
      },
    };

    // 如果有关键词，构建多字段匹配查询
    if (
      keyword &&
      keyword.length >= searchConfig.performance.minKeywordLength
    ) {
      const searchFields = fields || indexConfig.search.fields;
      const weights = indexConfig.search.weights;

      // 构建多字段匹配查询
      const multiMatchQuery: any = {
        multi_match: {
          query: keyword,
          fields: searchFields.map(
            (field) => `${field}^${weights[field] || 1}`,
          ),
          type: 'best_fields',
          tie_breaker: 0.3,
        },
      };

      // 添加模糊搜索配置
      if (searchConfig.advanced.fuzzy.enabled) {
        multiMatchQuery.multi_match.fuzziness =
          searchConfig.advanced.fuzzy.fuzziness;
        multiMatchQuery.multi_match.max_expansions =
          searchConfig.advanced.fuzzy.maxExpansions;
      }

      query.bool.must.push(multiMatchQuery);
    } else {
      // 如果没有关键词，返回所有文档
      query.bool.must.push({ match_all: {} });
    }

    return query;
  }

  /**
   * 构建高亮
   */
  private buildHighlight(indexKey: string, fields?: string[]): any {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    const highlightFields: any = {};
    const searchFields = fields || indexConfig.search.fields;

    searchFields.forEach((field) => {
      highlightFields[field] = {
        fragment_size: searchConfig.advanced.highlight.fragmentSize,
        number_of_fragments: searchConfig.advanced.highlight.numberOfFragments,
      };
    });

    return {
      pre_tags: [searchConfig.advanced.highlight.preTag],
      post_tags: [searchConfig.advanced.highlight.postTag],
      fields: highlightFields,
    };
  }

  /**
   * 执行聚合查询
   */
  async aggregate(
    indexKey: string,
    aggregations: any,
    filters?: any,
  ): Promise<any> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return {};
    }

    const query: any = {
      bool: {
        filter: filters || [],
      },
    };

    try {
      const response = await this.client.search({
        index: indexConfig.alias,
        size: 0,
        query,
        aggregations,
        timeout: `${searchConfig.performance.timeout}ms`,
      });

      return response.aggregations;
    } catch (error) {
      this.logger.error(`Aggregation failed in ${indexKey}`, error);
      throw error;
    }
  }

  /**
   * 滚动查询（用于大数据量导出）
   */
  async scroll(
    indexKey: string,
    query: any,
    scrollTimeout: string = '1m',
    size: number = 1000,
  ): Promise<{ scrollId: string; hits: any[]; total: number }> {
    const searchConfig = this.configService.get('search');
    const indexConfig = searchConfig.indexes[indexKey];

    if (!indexConfig.enabled) {
      this.logger.warn(`Index ${indexKey} is not enabled`);
      return { scrollId: '', hits: [], total: 0 };
    }

    try {
      const response = await this.client.search({
        index: indexConfig.alias,
        size,
        query,
        scroll: scrollTimeout,
      });

      return {
        scrollId: response._scroll_id || '',
        hits: response.hits.hits.map((hit: any) => hit._source || {}),
        total:
          typeof response.hits.total === 'number'
            ? response.hits.total
            : response.hits.total?.value || 0,
      };
    } catch (error) {
      this.logger.error(`Scroll search failed in ${indexKey}`, error);
      throw error;
    }
  }

  /**
   * 继续滚动查询
   */
  async scrollNext(
    scrollId: string,
    scrollTimeout: string = '1m',
  ): Promise<{
    scrollId: string;
    hits: any[];
    total: number;
    isFinished: boolean;
  }> {
    try {
      const response = await this.client.scroll({
        scroll_id: scrollId,
        scroll: scrollTimeout,
      });

      return {
        scrollId: response._scroll_id || '',
        hits: response.hits.hits.map((hit: any) => hit._source || {}),
        total:
          typeof response.hits.total === 'number'
            ? response.hits.total
            : response.hits.total?.value || 0,
        isFinished: response.hits.hits.length === 0,
      };
    } catch (error) {
      this.logger.error(`Scroll next failed`, error);
      throw error;
    }
  }

  /**
   * 清除滚动上下文
   */
  async clearScroll(scrollId: string): Promise<void> {
    try {
      await this.client.clearScroll({
        scroll_id: scrollId,
      });
    } catch (error) {
      this.logger.error(`Clear scroll failed`, error);
      // 忽略清除滚动上下文的错误
    }
  }
}
