// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, MoreThan } from 'typeorm';

// 内部依赖
import { CommonService } from '@shared';
import { KeyDto, KeyEntity, KeyLogEntity } from '..';

@Injectable()
export class KeyService extends CommonService<
  KeyDto,
  KeyDto,
  KeyEntity,
  KeyLogEntity
> {
  /**
   * 构造函数
   * @param keyRepository 账户存储器
   * @param keyLogRepository 账户日志存储器
   */
  constructor(
    @InjectRepository(KeyEntity)
    public readonly keyRepository: Repository<KeyEntity>,
    @InjectRepository(KeyLogEntity)
    private readonly keyLogRepository: Repository<KeyLogEntity>,
  ) {
    super('id', 'key', '云密钥', keyRepository, keyLogRepository);
  }

  /**
   * 获取对象清单
   * @param operateId 操作序号，用于返回增量数据
   * @returns 对象清单
   */
  async index(operateId: number = -1): Promise<KeyEntity[]> {
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
        update: { operateId: MoreThan(operateId) },
      },
    });
  }
}
