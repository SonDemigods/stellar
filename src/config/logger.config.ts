import { Params } from 'nestjs-pino';
import { join } from 'path';

// 日志文件路径
const logsDir = join(__dirname, '../../logs');
const logFilePath = join(logsDir, 'app');

export const LoggerConfig = {
  // 日志级别
  level: process.env.LOG_LEVEL || 'info',
  // 不记录日志的路径
  excludedPaths: ['/log'],
};

export const loggerOptions: Params = {
  pinoHttp: {
    // 配置多个传输目标：文件和控制台
    transport: {
      targets: [
        {
          target: 'pino-roll',
          options: {
            // 日志文件路径
            file: logFilePath,
            // 文件扩展名
            extension: '.log',
            // 每个日志文件的大小
            size: '10M',
            // 日志文件的滚动频率
            frequency: 'daily',
            // 保留的日志文件数量
            limit: {
              count: 1000,
            },
            // 如果目录不存在则创建
            mkdir: true,
            // 日志文件的日期格式
            dateFormat: 'yyyy-MM-dd',
            // 追加模式
            append: true,
          },
          level: LoggerConfig.level || 'info',
        },
        {
          // 控制台输出配置
          target: 'pino-pretty',
          options: {
            // 启用彩色输出
            colorize: true,
            // 格式化时间戳
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            // 显示级别标签
            levelFirst: true,
            // 隐藏进程ID
            ignore: 'pid,hostname',
            // 缩进日志对象
            singleLine: false,
          },
          level: LoggerConfig.level || 'info',
        },
      ],
    },
  },
};
