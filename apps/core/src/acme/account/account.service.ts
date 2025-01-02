// 外部依赖
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, MoreThan } from 'typeorm';
import * as acme from 'acme-client';

// 内部依赖
import { CreateEntity, CommonService } from '@shared';
import { AccountDto, AccountEntity, AccountLogEntity } from '..';

/**账户服务 */
@Injectable()
export class AccountService extends CommonService<
  number,
  AccountDto,
  AccountDto,
  AccountEntity,
  AccountLogEntity
> {
  /**账户缓存Map */
  public cache: Map<number, AccountEntity>;

  /**
   * 构造函数
   * @param accountRepository 账户存储器
   * @param accountLogRepository 账户日志存储器
   */
  constructor(
    @InjectRepository(AccountEntity)
    public readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccountLogEntity)
    private readonly accountLogRepository: Repository<AccountLogEntity>,
  ) {
    super('id', 'account', '账户', accountRepository, accountLogRepository);
    this.cache = new Map<number, AccountEntity>();
  }

  /**
   * 获取需同步数据
   * @returns 增量数据
   */
  protected async commons(): Promise<AccountEntity[]> {
    return await this.accountRepository.find({
      select: [
        'id',
        'config.email',
        'config.description',
        'config.staging',
        'config.status',
        'create.userId',
        'create.at',
        'update.userId',
        'update.at',
        'update.operateId',
        'update.operate',
        'update.reqId',
      ] as FindOptionsSelect<AccountEntity>,
      where: {
        update: { operateId: MoreThan(this.operateId) },
      },
    });
  }

  /**
   * 创建账户
   * @param config 新账户信息
   * @param userId 创建用户ID
   * @param reqId 请求日志ID
   * @returns 新账户主键ID，如果创建失败则返回0或抛出异常
   */
  async create(
    config: AccountDto,
    userId: number = 1,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'create', userId, reqId);
    /**创建信息 */
    const create = { userId: update.userId, at: update.at } as CreateEntity;
    /**账户私钥 */
    const accountKey = await acme.crypto.createPrivateKey();
    const client = new acme.Client({
      directoryUrl: config.staging
        ? acme.directory.letsencrypt.staging
        : acme.directory.letsencrypt.production,
      accountKey,
    });
    // 注册账户
    const account = await client.createAccount({
      termsOfServiceAgreed: true,
      contact: [`mailto:${config.email}`],
    });
    console.log('账户注册成功', account);
    /**对象信息 */
    const value = {
      config,
      accountKey,
      create,
      update,
    } as AccountEntity;
    try {
      /**操作结果 */
      const result = await this.accountRepository.insert(value);
      if (result.identifiers.length) {
        this.logSub.next(Number(update.operateId));
        // 更新缓存
        await this.sync();
        return result.identifiers[0].id;
      } else {
        return 0;
      }
    } catch (e) {
      console.error(`${this.description}创建失败`, config, e);
      throw new ConflictException(`${this.description}创建失败`);
    }
  }
}
