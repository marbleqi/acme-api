// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import {
  OperateEntity,
  ReqEntity,
  SettingEntity,
  SettingLogEntity,
  SortEntity,
  SortLogEntity,
  KeyEntity,
  KeyLogEntity,
  RedisService,
  OperateService,
  ReqService,
  SettingService,
  SortService,
  KeyService,
} from '.';

/**共享模块 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OperateEntity,
      ReqEntity,
      SettingEntity,
      SettingLogEntity,
      SortEntity,
      SortLogEntity,
      KeyEntity,
      KeyLogEntity,
    ]),
  ],
  providers: [
    RedisService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
    KeyService,
  ],
  exports: [
    RedisService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
    KeyService,
  ],
})
export class SharedModule {}
