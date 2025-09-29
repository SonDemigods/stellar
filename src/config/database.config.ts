import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // 确保端口号被正确转换为数字类型
  const port = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432;

  // 验证必要的环境变量
  if (!process.env.DATABASE_HOST) {
    throw new Error('数据库主机地址未配置');
  }

  if (!process.env.DATABASE_USER) {
    throw new Error('数据库用户名未配置');
  }

  if (!process.env.DATABASE_PASSWORD) {
    throw new Error('数据库密码未配置');
  }

  if (!process.env.DATABASE_NAME) {
    throw new Error('数据库名称未配置');
  }

  return {
    host: process.env.DATABASE_HOST,
    port,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
});
