// 外部依赖
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'body-parser';

// 内部依赖
import { AppModule } from '@src';

async function bootstrap() {
  /**应用 */
  const app = await NestFactory.create(AppModule);

  // 开启全局跨域许可
  app.enableCors({ origin: true });

  // 激活终止信号侦听器
  app.enableShutdownHooks();

  // 设置JSON解析器的限制
  app.use(json({ limit: 1073741824 }));
  process.on('warning', (e) => console.warn(e.stack));

  // 当开发环境或演示环境时，开启Swagger文档
  if (process.env.NODE_ENV && ['dev', 'demo'].includes(process.env.NODE_ENV)) {
    SwaggerModule.setup(
      'swagger',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('证书管理平台API')
          .setDescription('证书管理平台后端API接口文档')
          .setVersion('0.0.1')
          .build(),
      ),
    );
  }
  await app.listen(process.env.PORT ?? 80);
}
void bootstrap();
