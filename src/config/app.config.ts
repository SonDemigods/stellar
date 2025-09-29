import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    name: process.env.APP_NAME || 'galaxy',
    cName: process.env.APP_CNAME || '森罗万象',
    version: process.env.APP_VERSION || '1.0.0',
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    env: process.env.NODE_ENV || 'development',
  };
});
