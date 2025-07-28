import { Params } from 'nestjs-pino';
import { join } from 'path';

// 日志文件路径
const logFilePath = join(__dirname, '../../logs/app.log');

export const loggerOptions: Params = {
  pinoHttp: {
    // 配置多个传输目标：文件和控制台
    transport: {
      targets: [
        {
          target: 'pino/file',
          options: {
            // 日志文件路径
            destination: logFilePath,
            // 如果目录不存在则创建
            mkdir: true,
            // 追加模式
            append: true,
          },
          level: 'info',
        },
      ],
    },
  },
};
