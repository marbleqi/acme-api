// 外部依赖
import { Module } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
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
  QueueService,
  OperateService,
  ReqService,
  SettingService,
  SortService,
  KeyService,
} from '.';

/**共享模块 */
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'shared',
      useFactory: () => {
        if (!process.env.REDIS_HOST) {
          throw new Error('未配置redis地址');
        }
        /**redis地址 */
        const host = process.env.REDIS_HOST;
        /**redis端口 */
        const port = parseInt(process.env.REDIS_PORT, 10) || 6379;
        /**redis数据库 */
        const db = parseInt(process.env.REDIS_DB, 10) || 0;
        /**redis密码 */
        const password = process.env.REDIS_PSW || '';
        console.debug('队列redis已连接');
        return { host, port, db, password } as BullModuleOptions;
      },
    }),
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
    QueueService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
    KeyService,
  ],
  exports: [
    RedisService,
    QueueService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
    KeyService,
  ],
})
export class SharedModule {}
