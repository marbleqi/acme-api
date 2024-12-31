import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AliyunModule } from './aliyun/aliyun.module';

@Module({
  imports: [SharedModule, AuthModule, AliyunModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
