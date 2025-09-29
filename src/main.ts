import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

// 全局拦截器
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { LoggingInterceptor } from '@/common/interceptor/logger.interceptor';

// 根模块
import { AppModule } from '@/app.module';

// 提供者
import { LogService } from '@/module/log/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.flushLogs();

  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 日志拦截器
  const pinoLogger = await app.resolve(PinoLogger);
  const logService = await app.resolve(LogService);
  app.useGlobalInterceptors(new LoggingInterceptor(pinoLogger, logService));

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      // 自动将参数转换为 DTO 中定义的类型
      transform: true,
      // 自动过滤掉 DTO 中没有定义的字段
      whitelist: true,
      // 禁止非白名单字段
      forbidNonWhitelisted: false,
      // 禁止空值
      disableErrorMessages: false,
    }),
  );

  // 使用配置服务获取端口
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  await app.listen(port);
  console.log(`森罗万象已启动，监听端口:${port}`);
}

void bootstrap();
