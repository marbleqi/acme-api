// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import {
  OperateEntity,
  ReqEntity,
  SettingEntity,
  SettingLogEntity,
  OperateService,
  ReqService,
  RedisService,
  SettingService,
} from '.';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OperateEntity,
      ReqEntity,
      SettingEntity,
      SettingLogEntity,
    ]),
  ],
  providers: [OperateService, ReqService, RedisService, SettingService],
  exports: [OperateService, ReqService, RedisService, SettingService],
})
export class SharedModule {}
