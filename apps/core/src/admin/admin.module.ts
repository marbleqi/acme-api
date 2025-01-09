import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { AuthModule } from '@auth';
import { KeyController } from '.';

// TODO：仅包含了密钥管理，后续还应增加请求日志查看，系统配置等

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [KeyController],
})
export class AdminModule {}
