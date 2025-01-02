// 外部依赖
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'body-parser';

// 内部依赖
import { CoreModule } from './core.module';

/**项目启动函数 */
async function bootstrap() {
  /**应用 */
  const app = await NestFactory.create(CoreModule);
  // 开启全局跨域许可
  app.enableCors({ origin: true });
  // 激活终止信号侦听器
  app.enableShutdownHooks();
  // 设置JSON解析器的限制
  app.use(json({ limit: 1073741824 }));
  process.on('warning', (e) => console.warn(e.stack));
  // 当开发环境或演示环境时，开启Swagger文档
  if (['dev', 'demo'].includes(process.env.NODE_ENV)) {
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
  // 开启服务监听
  await app.listen(parseInt(process.env.CORE_PORT, 10) || 80);
  // console.debug('core服务已启动A', process.env);
}
bootstrap();
