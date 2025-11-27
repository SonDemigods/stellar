import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => {
  // 验证必要的环境变量
  if (!process.env.MINIO_ENDPOINT) {
    throw new Error('MinIO端点地址未配置');
  }

  if (!process.env.MINIO_ACCESS_KEY) {
    throw new Error('MinIO访问密钥未配置');
  }

  if (!process.env.MINIO_SECRET_KEY) {
    throw new Error('MinIO秘密密钥未配置');
  }

  if (!process.env.MINIO_BUCKET_NAME) {
    throw new Error('MinIO存储桶名称未配置');
  }

  return {
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
    region: process.env.MINIO_REGION || 'us-east-1',
    secure: process.env.MINIO_SECURE === 'true',
    fileSizeLimit: process.env.MINIO_FILE_SIZE_LIMIT 
      ? parseInt(process.env.MINIO_FILE_SIZE_LIMIT, 10) 
      : 50 * 1024 * 1024, // 默认50MB
    allowedFileTypes: process.env.MINIO_ALLOWED_FILE_TYPES 
      ? process.env.MINIO_ALLOWED_FILE_TYPES.split(',') 
      : ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
  };
});
