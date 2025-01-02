// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 内部依赖
import { CommonService } from '@shared';
import { RoleDto, RoleEntity, RoleLogEntity } from '..';

/**角色服务 */
@Injectable()
export class RoleService extends CommonService<
  number,
  RoleDto,
  RoleDto,
  RoleEntity,
  RoleLogEntity
> {
  /**角色缓存Map */
  public cache: Map<number, RoleEntity>;

  /**
   * 构造函数
   * @param roleRepository 角色存储器
   * @param roleLogRepository 角色日志存储器
   */
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleLogEntity)
    private readonly roleLogRepository: Repository<RoleLogEntity>,
  ) {
    super('id', 'role', '角色', roleRepository, roleLogRepository);
    this.cache = new Map<number, RoleEntity>();
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 缓存同步
    await this.sync();
    // 如果没有角色，则执行角色数据的初始化
    if (!this.cache.size) {
      const config = {
        name: '超级管理员',
        description: '超级管理员',
        abilities: [
          100, 110, 111, 112, 120, 121, 122, 123, 124, 125, 130, 131, 132, 133,
          134, 135, 140, 141, 142, 143, 144, 145, 150, 151, 152, 153, 154, 155,
          156, 157, 160, 161, 162, 163, 164, 165, 170, 171, 176,
        ],
        status: true,
      };
      await this.create(config);
    }
  }

  /**
   * 设置拥有权限点的角色清单
   *
   * 根据权限点ID，设置拥有权限点的角色ID清单
   * @param ids 需要授权的角色ID集合
   * @param id 权限点ID
   * @param userId 更新用户ID
   * @param reqId 请求日志ID
   * @returns 更新记录数
   */
  async grant(
    ids: number[],
    id: number,
    userId: number = 1,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'grant', userId, reqId);
    /**待保存数据 */
    const data: RoleEntity[] = [];
    for (const role of Array.from(this.cache.values())) {
      // 增加角色的权限的条件
      if (!role.config.abilities.includes(id) && ids.includes(role.id)) {
        // 增加角色的权限
        role.config.abilities.push(id);
        data.push({
          id: role.id,
          config: { abilities: role.config.abilities },
          update,
        } as RoleEntity);
      }
      // 删除角色的权限的条件
      if (role.config.abilities.includes(id) && !ids.includes(role.id)) {
        // 删除角色的权限
        role.config.abilities = role.config.abilities.filter(
          (item) => item !== id,
        );
        data.push({
          id: role.id,
          config: { abilities: role.config.abilities },
          update,
        } as unknown as RoleEntity);
      }
    }
    /**保存结果 */
    const result = await this.roleRepository.save(data);
    this.logSub.next(Number(update.operateId));
    return result.length;
  }
}
