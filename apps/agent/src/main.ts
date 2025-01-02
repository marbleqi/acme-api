// 外部依赖
import { NestFactory } from '@nestjs/core';
import { json } from 'body-parser';

// 内部依赖
import { AgentModule } from './agent.module';

/**探针启动函数 */
async function bootstrap() {
  /**应用 */
  const app = await NestFactory.create(AgentModule);
  // 激活终止信号侦听器
  app.enableShutdownHooks();
  // 设置JSON解析器的限制
  app.use(json({ limit: 1073741824 }));
  process.on('warning', (e) => console.warn(e.stack));

  // 开启服务监听
  await app.listen(process.env.AGENT_PORT || 3000);
}
bootstrap();
