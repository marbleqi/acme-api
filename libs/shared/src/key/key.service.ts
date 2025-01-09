// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, MoreThan } from 'typeorm';

// 内部依赖
import { KeyDto, KeyEntity, KeyLogEntity, CommonService } from '..';

// DONE:已完成检查

/**密钥管理服务 */
@Injectable()
export class KeyService extends CommonService<
  KeyDto,
  KeyDto,
  KeyEntity,
  KeyLogEntity
> {
  /**
   * 构造函数
   * @param keyRepository 密钥存储器
   * @param keyLogRepository 密钥日志存储器
   */
  constructor(
    @InjectRepository(KeyEntity)
    public readonly keyRepository: Repository<KeyEntity>,
    @InjectRepository(KeyLogEntity)
    private readonly keyLogRepository: Repository<KeyLogEntity>,
  ) {
    super('id', 'key', '密钥', keyRepository, keyLogRepository);
  }

  /**
   * 获取同步数据
   * @returns 待同步的对象数据
   */
  protected async commons(): Promise<KeyEntity[]> {
    return await this.keyRepository.find({
      select: [
        'id',
        'config.name',
        'config.description',
        'config.provider',
        'config.key',
        'config.status',
        'create.userId',
        'create.at',
        'update.userId',
        'update.at',
        'update.operateId',
        'update.operate',
        'update.reqId',
      ] as FindOptionsSelect<KeyEntity>,
      where: {
        update: { operateId: MoreThan(this.operateId) },
      },
    });
  }
}
