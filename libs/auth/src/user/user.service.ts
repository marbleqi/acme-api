// 外部依赖
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, MoreThan, Not } from 'typeorm';
import { genSalt, hash, compare, compareSync } from 'bcrypt';

// 内部依赖
import { CommonService } from '@shared';
import { UserDto, UserEntity, UserLogEntity, RoleService } from '..';

/**用户服务 */
@Injectable()
export class UserService extends CommonService<
  number,
  UserDto,
  UserDto,
  UserEntity,
  UserLogEntity
> {
  /**用户缓存Map */
  public cache: Map<number, UserEntity>;

  /**
   * 构造函数
   * @param userRepository 用户存储器
   * @param userLogRepository 用户日志存储器
   * @param roleSrv 角色服务
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserLogEntity)
    private readonly userLogRepository: Repository<UserLogEntity>,
    private readonly roleSrv: RoleService,
  ) {
    super('id', 'user', '用户', userRepository, userLogRepository);
    this.cache = new Map<number, UserEntity>();
  }

  /**
   * 获取需同步数据
   * @returns 增量数据
   */
  protected async commons(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'config.loginName',
        'config.name',
        'config.avatar',
        'config.email',
        'config.roles',
        'config.status',
        'config.locked',
        'create.userId',
        'create.at',
        'update.userId',
        'update.at',
        'update.operateId',
        'update.operate',
        'update.reqId',
      ] as FindOptionsSelect<UserEntity>,
      where: {
        update: { operateId: MoreThan(this.operateId) },
      },
    });
  }

  /**启动初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 缓存同步
    await this.sync();
    // 如果没有用户，则执行用户数据的初始化
    if (!this.cache.size) {
      /**新用户超级管理员 */
      const config = {
        loginName: 'root',
        name: '超级管理员',
        roles: [1],
        status: true,
        password: `$2b$10$VYml51aRjNYcpYPnqqACRu1iLEZ5xzrHXBzc.01LrjKHYiq8OdfZS`,
      };
      await this.create(config);
    }
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   * @param allowNull 允许返回null，默认false
   * @returns 用户详情
   */
  async show(id: number, allowNull: boolean = false): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'config.loginName',
        'config.name',
        'config.avatar',
        'config.email',
        'config.roles',
        'config.status',
        'config.locked',
        'pswTimes',
        'loginTimes',
        'firstLoginAt',
        'lastLoginIp',
        'lastLoginAt',
        'lastSessionAt',
        'create.userId',
        'create.at',
        'update.userId',
        'update.at',
        'update.operateId',
        'update.operate',
        'update.reqId',
      ] as FindOptionsSelect<UserEntity>,
      where: { id },
    });
    if (allowNull || user) {
      return user;
    }
    throw new NotFoundException(`用户不存在`);
  }

  /**
   * 创建用户
   * @param config 用户配置信息
   * @param userId 创建用户ID
   * @param reqId 请求日志ID
   * @returns 用户ID
   */
  async create(
    config: UserDto,
    userId: number = 1,
    reqId: number = 0,
  ): Promise<number | string> {
    /**查询已使用了该登陆名的用户 */
    const user = await this.userRepository.findOneBy({
      config: { loginName: config.loginName },
    });
    // 如果用户存在
    if (user) {
      throw new ConflictException('登陆名已被已有用户使用');
    }
    return await super.create(config, userId, reqId);
  }

  /**
   * 修改用户
   * @param id 用户ID
   * @param config 用户配置信息
   * @param userId 创建用户ID
   * @param reqId 请求日志ID
   * @returns 更新记录数
   */
  async update(
    id: number,
    config: UserDto,
    userId: number,
    reqId: number,
  ): Promise<number> {
    /**查询已使用了该登陆名的其他用户 */
    const user = await this.userRepository.findOneBy({
      config: { loginName: config.loginName },
      id: Not(id), // 排除当前用户
    });
    // 如果用户存在
    if (user) {
      throw new ConflictException('登陆名已被其他用户使用');
    }
    return await super.update(id, config, userId, reqId);
  }

  /**
   * 获取用户权限点
   * @param id 用户ID
   * @returns 权限点数组
   */
  ability(id: number): number[] {
    return Array.from(this.roleSrv.cache.values())
      .filter((role) => this.cache.get(id).config.roles.includes(role.id))
      .reduce((prev, role) => prev.concat(role.config.abilities), []);
  }

  /**
   * 验证用户与权限点关系是否无效（注：无效返回true）
   * @param id 用户ID
   * @param abilities 权限点数组
   * @returns 验证结果
   */
  invalid(id: number, abilities: number[]): boolean {
    return (
      abilities.length &&
      Array.from(this.roleSrv.cache.values())
        .filter((role) => this.cache.get(id).config.roles.includes(role.id))
        .every((role) =>
          role.config.abilities.every(
            (ability) => !abilities.includes(ability),
          ),
        )
    );
  }

  /**
   * 更新用户登陆时间及IP地址
   * @param id 用户ID
   */
  async logined(id: number, loginIp: string): Promise<void> {
    const at = Date.now();
    await this.userRepository.update(id, {
      lastLoginAt: at,
      lastLoginIp: loginIp,
      lastSessionAt: at,
    });
    await this.userRepository.increment({ id }, 'loginTimes', 1);
  }

  /**
   * 更新用户最后会话时间
   * @param id 用户ID
   */
  async session(id: number): Promise<void> {
    await this.userRepository.update(id, { lastSessionAt: Date.now() });
  }

  /**
   * 解锁用户
   * @param user 待解锁的用户
   * @param id 待解锁的用户ID
   * @param update 更新信息
   * @returns 响应报文
   */
  async unlock(
    ids: number[],
    userId: number = 1,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'unlock', userId, reqId);
    const result = await this.userRepository.update(ids, {
      config: { locked: false },
      pswTimes: 0,
      update,
    });
    if (result.affected) {
      this.logSub.next(Number(update.operateId));
    }
    return result.affected;
  }

  /**
   * 重置用户密码
   * @param id 待重置密码的用户ID
   * @param newpsw 新密码明文
   * @param update 更新信息
   * @returns 响应报文
   */
  async resetpsw(
    id: number,
    newpsw: string,
    userId: number = 1,
    reqId: number = 0,
  ): Promise<number> {
    /**更新信息 */
    const update = await this.getUpdate(this.name, 'resetpsw', userId, reqId);
    /**密码盐 */
    const salt = await genSalt();
    /**密码密文 */
    const password = await hash(newpsw, salt);
    /**更新用户结果 */
    const result = await this.userRepository.update(id, {
      config: { password },
      update,
    });
    if (result.affected) {
      this.logSub.next(Number(update.operateId));
    }
    return result.affected;
  }

  /**
   * 设置拥有角色的用户清单
   *
   * 根据角色ID，设置拥有角色的用户ID清单
   * @param ids 需要授权的用户ID数组
   * @param id 角色ID
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
    // 待保存数据
    const data: UserEntity[] = [];
    for (const user of Array.from(this.cache.values())) {
      // 增加用户的角色的条件
      if (!user.config.roles.includes(id) && ids.includes(user.id)) {
        // 增加用户的角色
        user.config.roles.push(id);
        data.push({
          id: user.id,
          config: { roles: user.config.roles },
          update,
        } as UserEntity);
      }
      // 删除用户的角色的条件
      if (user.config.roles.includes(id) && !ids.includes(user.id)) {
        // 删除用户的角色
        user.config.roles = user.config.roles.filter((item) => item !== id);
        data.push({
          id: user.id,
          config: { roles: user.config.roles },
          update,
        } as UserEntity);
      }
    }
    // 保存数据
    await this.userRepository.save(data);
    this.logSub.next(Number(update.operateId));
    return data.length;
  }
}
