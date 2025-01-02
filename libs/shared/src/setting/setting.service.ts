// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 内部依赖
import { SettingEntity, SettingLogEntity, CommonService } from '..';

/**配置服务 */
@Injectable()
export class SettingService extends CommonService<
  string,
  any,
  any,
  SettingEntity,
  SettingLogEntity
> {
  /**
   * 构造函数
   * @param settingRepository 配置存储器
   * @param settingLogRepository 配置日志存储器
   */
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
    @InjectRepository(SettingLogEntity)
    private readonly settingLogRepository: Repository<SettingLogEntity>,
  ) {
    super('key', 'setting', '配置项', settingRepository, settingLogRepository);
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 缓存同步
    await this.sync();
    // 如果未配置系统参数，则配置系统参数
    if (!this.cache.has('system')) {
      /**系统配置 */
      const config = {
        name: '管理平台',
        title: '管理平台',
        description: '平台在手，天下我有。',
        company: '***公司',
        domain: '***.com',
        icp: '*ICP备*号-*',
        expired: 30,
        password: true,
        wxwork: false,
        dingtalk: false,
      };
      // 保存系统配置
      await this.upsert('system', config, 1, 0);
    }
  }
}
