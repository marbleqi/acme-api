// 外部依赖
import { NestFactory } from '@nestjs/core';

// 内部依赖
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
