import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// 全局拦截器
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';

// 根模块
import { AppModule } from '@/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动将参数转换为 DTO 中定义的类型
      whitelist: true, // 自动过滤掉 DTO 中没有定义的字段
      forbidNonWhitelisted: false,
      disableErrorMessages: false,
    }),
  );
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
