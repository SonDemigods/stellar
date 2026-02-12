// src/types/typeorm.d.ts

import { QueryFailedError as OriginalQueryFailedError } from 'typeorm';

/**
 * 扩展 TypeORM 的 QueryFailedError，以支持 PostgreSQL（及其他数据库）的常见错误属性。
 *
 * PostgreSQL 通过 node-postgres (pg) 驱动抛出的错误通常包含：
 * - code: SQLSTATE（如 '23505'）
 * - detail: 错误详情（如 "Key (email)=(test@example.com) already exists."）
 * - hint: 建议（如 "Change the email or use ON CONFLICT DO NOTHING."）
 * - table, column, constraint 等（可选）
 *
 * MySQL / SQLite 可能只提供 code（如 'ER_DUP_ENTRY'），但为通用性保留 string | undefined。
 */
declare module 'typeorm' {
  interface QueryFailedError extends OriginalQueryFailedError {
    /**
     * 数据库错误代码：
     * - PostgreSQL: SQLSTATE (e.g., '23505')
     * - MySQL: ER_XXX (e.g., 'ER_DUP_ENTRY')
     * - SQLite: extended error code (number, but often stringified)
     */
    code?: string;

    /**
     * PostgreSQL 特有：详细错误信息
     */
    detail?: string;

    /**
     * PostgreSQL 特有：建议信息
     */
    hint?: string;

    /**
     * PostgreSQL 特有：涉及的表名
     */
    table?: string;

    /**
     * PostgreSQL 特有：涉及的列名
     */
    column?: string;

    /**
     * PostgreSQL 特有：违反的约束名（如 "UQ_abc123"）
     */
    constraint?: string;
  }
}
