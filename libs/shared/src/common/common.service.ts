// 外部依赖
import {
  OnApplicationBootstrap,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere, MoreThan } from 'typeorm';
import { Subject } from 'rxjs';

// 内部依赖
import { CreateEntity, BaseService } from '..';

// TODO：目前仅考虑了数据缓存方案，后续应增加不缓存的数据处理方案。

/**
 * 当前默认实现逻辑：
 * 1. 数据全部缓存在应用内存中；
 * 2. 数据更新操作后，会先更新数据库；
 * 3. 完成数据库更新后，会触发追加更新对象日志记录；
 * 4. 然后根据操作序号，从数据库中获取增量数据，刷新缓存。
 * 后续根据具体的数据量情况，需要进行相关调整：
 * 1. 如果数据量不大，则保持当前实现逻辑；
 * 2. 如果数据量较大，则需要进行分页处理，同时需要调整缓存策略。
 * 3. 如果数据量非常大，则需要考虑使用分布式缓存，同时需要调整缓存策略。
 * 4. 如果数据量非常大，且需要实时更新，则需要考虑使用消息队列，同时需要调整缓存策略。
 */
/**
 * 通用对象服务类，用于处理实体的增删改查操作。
 *
 * @template CreateDto - 创建对象时使用的 DTO（数据传输对象）类型。
 * @template UpdateDto - 更新对象时使用的 DTO 类型。
 * @template Entity - 实体类型，必须是一个对象字面量。
 * @template EntityLog - 实体日志类型，必须是一个对象字面量。
 */
export class CommonService<
    CreateDto,
    UpdateDto,
    Entity extends ObjectLiteral,
    EntityLog extends ObjectLiteral,
  >
  extends BaseService
  implements OnApplicationBootstrap
{
  /**操作对象主键名 */
  protected readonly pk: string;
  /**操作对象 */
  protected readonly name: string;
  /**对象说明 */
  protected readonly description: string;
  /**通用对象缓存Map */
  public cache: Map<number | string, Entity>;
  /**最大操作序号 */
  protected operateId: number;
  /**日志更新订阅 */
  protected logSub: Subject<number>;

  /**
   * 构造函数
   * @param pk 操作对象主键名
   * @param name 操作对象
   * @param description 对象说明
   * @param commonRepository 对象存储器
   * @param commonLogRepository 对象日志存储器
   */
  protected constructor(
    pk: string,
    name: string,
    description: string,
    protected readonly commonRepository: Repository<Entity>,
    protected readonly commonLogRepository: Repository<EntityLog>,
  ) {
    super();
    this.pk = pk;
    this.name = name;
    this.description = description;
    this.cache = new Map<number | string, Entity>();
    this.operateId = -1;
    this.logSub = new Subject<number>();
    // 追加对象更新日志
    this.logSub.subscribe(async (operateId) => await this.addLog(operateId));
  }

  /**
   * 获取同步数据
   * @returns 待同步的对象数据
   */
  protected async commons(): Promise<Entity[]> {
    return await this.commonRepository.findBy({
      update: {
        operateId: MoreThan(this.operateId),
      },
    } as unknown as FindOptionsWhere<Entity>);
  }

  /**更新缓存 */
  async sync(): Promise<void> {
    /**待同步的对象数据 */
    const commons = await this.commons();
    for (const common of commons) {
      this.cache.set(common[this.pk], common);
      if (this.operateId < common.update.operateId) {
        this.operateId = common.update.operateId;
      }
    }
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    await this.sync();
  }

  /**
   * 获取对象清单
   * @param operateId 操作序号，用于返回增量数据
   * @returns 对象清单
   */
  async index(operateId: number = -1): Promise<Entity[]> {
    // 更新缓存
    await this.sync();
    return Array.from(this.cache.values()).filter(
      (common) => common.update.operateId > operateId,
    );
  }

  /**
   * 获取对象详情
   * @param pk 对象主键值
   * @param allowNull 允许返回null，默认false
   * @returns 对象详情
   */
  async show(pk: number | string, allowNull: boolean = false): Promise<Entity> {
    const result = await this.commonRepository.findOneBy({
      [this.pk]: pk,
    } as unknown as FindOptionsWhere<Entity>);
    if (allowNull || result) {
      return result;
    }
    throw new NotFoundException(`${this.pk}为${pk}的${this.description}不存在`);
  }

  /**
   * 获取对象变更日志
   * @param pk 对象主键值
   * @returns 对象变更日志记录
   */
  async log(pk: number | string): Promise<EntityLog[]> {
    return await this.commonLogRepository.findBy({
      [this.pk]: pk,
    } as unknown as FindOptionsWhere<EntityLog>);
  }

  /**重置缓存 */
  async reset(): Promise<void> {
    // 清空缓存
    this.cache.clear();
    // 重置操作序号
    this.operateId = -1;
    // 缓存同步
    await this.sync();
  }

  /**
   * 创建对象
   * @param config 新对象信息
   * @param userId 操作用户ID
   * @param reqId 请求日志ID
   * @param pk 对象主键值（可选）
   * @returns 新对象主键ID，如果创建失败则返回0或抛出异常
   */
  async create(
    config: CreateDto,
    userId: number = 0,
    reqId: number = 0,
    pk?: number | string,
  ): Promise<number | string> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'create', userId, reqId);
    /**创建信息 */
    const create = { userId: update.userId, at: update.at } as CreateEntity;
    /**对象信息 */
    let value: Entity;
    if (pk) {
      // 如果指定了主键值，则使用该值
      value = {
        [this.pk]: pk,
        config,
        create,
        update,
      } as unknown as Entity;
    } else {
      value = {
        config,
        create,
        update,
      } as unknown as Entity;
    }
    try {
      /**操作结果 */
      const result = await this.commonRepository.insert(value);
      if (result.identifiers.length) {
        this.logSub.next(Number(update.operateId));
        // 更新缓存
        await this.sync();
        return result.identifiers[0][this.pk];
      } else {
        return 0;
      }
    } catch (e) {
      console.error(`${this.description}创建失败`, config, e);
      throw new ConflictException(`${this.description}创建失败`);
    }
  }

  /**
   * 更新对象
   * @param pk 对象主键值
   * @param config 对象更新信息
   * @param userId 操作用户ID
   * @param reqId 请求日志ID
   * @returns 更新记录数
   */
  async update(
    pk: number | string,
    config: UpdateDto,
    userId: number = 0,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'update', userId, reqId);
    try {
      /**操作结果 */
      const result = await this.commonRepository.update(pk, {
        config,
        update,
      } as unknown as Entity);
      if (result.affected) {
        this.logSub.next(Number(update.operateId));
        // 更新缓存
        await this.sync();
      }
      return result.affected;
    } catch (e) {
      console.error(
        `${this.pk}为${pk}的${this.description}更新失败`,
        config,
        e,
      );
      throw new ConflictException(
        `${this.pk}为${pk}的${this.description}更新失败`,
      );
    }
  }

  /**
   * 覆盖对象（有则更新，无则创建）
   * @param pk 对象主键值
   * @param config 对象更新信息
   * @param userId 操作用户ID
   * @param reqId 请求日志ID
   * @returns 更新记录数
   */
  async upsert(
    pk: number | string,
    config: UpdateDto,
    userId: number = 0,
    reqId: number = 0,
  ): Promise<number> {
    /**当前对象 */
    const result = await this.commonRepository.findOneBy({
      [this.pk]: pk,
    } as unknown as FindOptionsWhere<Entity>);
    if (result) {
      // 当前对象存在，执行更新逻辑
      /**更新信息 */
      const update = await this.getUpdate(this.name, 'update', userId, reqId);
      try {
        /**操作结果 */
        const result = await this.commonRepository.update(pk, {
          config,
          update,
        } as unknown as Entity);
        if (result.affected) {
          this.logSub.next(Number(update.operateId));
          // 更新缓存
          await this.sync();
        }
        return result.affected;
      } catch (e) {
        console.error(
          `${this.pk}为${pk}的${this.description}更新失败`,
          config,
          e,
        );
        throw new ConflictException(
          `${this.pk}为${pk}的${this.description}更新失败`,
        );
      }
    } else {
      // 当前对象不存在，执行创建逻辑
      /**更新信息 */
      const update = await this.getUpdate(this.name, 'create', userId, reqId);
      /**创建信息 */
      const create = { userId: update.userId, at: update.at } as CreateEntity;
      try {
        /**操作结果 */
        const result = await this.commonRepository.insert({
          [this.pk]: pk,
          config,
          create,
          update,
        } as unknown as Entity);
        console.debug('创建结果', result);
        if (result.identifiers.length) {
          this.logSub.next(Number(update.operateId));
          // 更新缓存
          await this.sync();
        }
        return result.identifiers.length;
      } catch (e) {
        console.error(
          `${this.pk}为${pk}的${this.description}创建失败`,
          config,
          e,
        );
        throw new ConflictException(
          `${this.pk}为${pk}的${this.description}创建失败`,
        );
      }
    }
  }

  /**
   * 批量更新对象状态
   * @param pks 需要更新的对象主键值集合
   * @param status 待设置的对象状态
   * @param userId 操作用户ID
   * @param reqId 请求日志ID
   * @returns 更新记录数
   */
  async status(
    pks: number[] | string[],
    status: boolean,
    userId: number = 0,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'status', userId, reqId);
    try {
      /**操作结果 */
      const result = await this.commonRepository.update(pks, {
        config: { status },
        update,
      } as unknown as Entity);
      if (result.affected) {
        this.logSub.next(Number(update.operateId));
        // 更新缓存
        await this.sync();
      }
      return result.affected;
    } catch (e) {
      console.error(`${this.description}状态批量更新失败`, pks, status, e);
      throw new ConflictException(`${this.description}更新失败`);
    }
  }

  /**
   * 批量删除对象
   * @param pks 需要删除的对象主键值集合
   * @param userId 操作用户ID
   * @param reqId 请求日志ID
   */
  async delete(
    pks: number[] | string[],
    userId: number = 0,
    reqId: number = 0,
  ) {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'delete', userId, reqId);
    // 先标记待删除的记录状态为false
    await this.commonRepository.update(pks, {
      config: { status: false },
      update,
    } as unknown as Entity);
    // 将待删除的记录添加到日志表中
    await this.addLog(update.operateId);
    // 更新缓存
    for (const pk of pks) {
      this.cache.delete(pk);
    }
    await this.sync();
    // 将待删除的记录进行删除
    await this.commonRepository.delete(pks);
  }

  /**清空表（包括对象表和日志表） */
  async clear() {
    await this.commonRepository.clear();
    await this.commonLogRepository.clear();
  }

  /**
   * 追加变更日志
   * @param operateId 操作序号
   */
  protected async addLog(operateId: number): Promise<void> {
    /**待追加的日志记录 */
    const commons: EntityLog[] = (await this.commonRepository.findBy({
      update: { operateId },
    } as unknown as FindOptionsWhere<Entity>)) as unknown as EntityLog[];
    // 追加日志
    await this.commonLogRepository.insert(commons);
  }
}
