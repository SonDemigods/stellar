import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'galaxy',
  version: process.env.APP_VERSION || '1.0.0',
  port: process.env.APP_PORT,
  env: process.env.NODE_ENV || 'development',
}));
