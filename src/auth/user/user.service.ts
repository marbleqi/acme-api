// 外部依赖
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, MoreThan } from 'typeorm';
import { genSalt, hash, compare, compareSync } from 'bcrypt';
// 内部依赖
import { CreateEntity, UpdateEntity, CommonService } from '@shared';
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
  /**
   * 构造函数
   * @param userRepository 用户存储器
   * @param userLogRepository 用户日志存储器
   * @param operateSrv 操作序号服务
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
   * @returns 用户详情
   */
  async show(id: number): Promise<UserEntity> {
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
    if (user) {
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
    // 判断登陆名是否已被使用
    if (
      Array.from(this.cache.values()).some(
        (item) => item.config.loginName === config.loginName,
      )
    ) {
      throw new ForbiddenException('登陆名已被已有用户使用');
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
    if (config.loginName) {
      // 判断登陆名是否已被使用
      if (
        Array.from(this.cache.values()).some(
          (item) =>
            item.config.loginName === config.loginName && item.id !== id,
        )
      ) {
        throw new ForbiddenException('登陆名已被其他用户使用');
      }
    }
    return await super.update(id, config, userId, reqId);
  }

  // /**
  //  * 获取用户权限点
  //  * @param id 用户ID
  //  * @returns 权限点数组
  //  */
  // // async ability(id: number): Promise<number[]> {
  // //   return [];
  // //   const roles = await this.roleSrv.index();
  // //   return roles
  // //     .filter((role) => this.get(id).roles.includes(role.id))
  // //     .reduce((prev, role) => prev.concat(role.abilities), []);
  // // }

  // /**
  //  * 验证用户与权限点关系是否无效（注：无效返回true）
  //  * @param id 用户ID
  //  * @param abilities 权限点数组
  //  * @returns 验证结果
  //  */
  // // invalid(id: number, abilities: number[]): boolean {
  // //   return (
  // //     abilities.length &&
  // //     this.roleSrv
  // //       .list()
  // //       .filter((role) => this.get(id).roles.includes(role.id))
  // //       .every((role) =>
  // //         role.abilities.every((ability) => !abilities.includes(ability)),
  // //       )
  // //   );
  // // }

  // /**
  //  * 用户登陆
  //  * @param loginName 登陆名
  //  * @param loginPsw 登陆密码
  //  * @param loginIp 用户IP
  //  * @returns 登陆用户
  //  */
  // async login(
  //   loginName: string,
  //   loginPsw: string,
  //   loginIp: string,
  // ): Promise<UserEntity> {
  //   /**用户对象 */
  //   const user = await this.userRepository.findOne({
  //     select: [
  //       'id',
  //       'loginName',
  //       'name',
  //       'password',
  //       'config',
  //       'status',
  //       'locked',
  //       'pswTimes',
  //       'loginTimes',
  //       'firstLoginAt',
  //     ],
  //     where: { loginName },
  //   });
  //   console.debug('loginName', loginName);
  //   console.debug('loginPsw', loginPsw);
  //   console.debug('loginIp', loginIp, loginIp.length);
  //   console.debug('userA', user);
  //   // 判断用户是否存在
  //   if (!user) {
  //     throw new UnauthorizedException(`该用户不存在！`);
  //   }
  //   console.debug('已判断用户存在');
  //   // 判断用户启用状态
  //   if (!user.status) {
  //     throw new UnauthorizedException(`用户${user.name}账号已被禁用！`);
  //   } // 判断用户锁定状态
  //   console.debug('已判断用户有效');
  //   if (user.locked) {
  //     throw new UnauthorizedException(`用户${user.name}账号已被锁定！`);
  //   }
  //   console.debug('已判断用户未锁定');
  //   // 判断是否授权用户密码登陆
  //   if (!user.config.pswLogin) {
  //     throw new UnauthorizedException(
  //       `用户${user.name}不允许使用密码登陆方式！`,
  //     );
  //   }
  //   console.debug('已判断用户允许密码登录');
  //   /**判断密码是否一致 */
  //   console.debug('开始判断密码是否一致', loginPsw, user.password);
  //   const check = compareSync(loginPsw, user.password);
  //   console.debug('判断密码是否一致check', check);
  //   // 判断密码密文是否一致
  //   if (!check) {
  //     // 密码密文不一致，密码错误计数加1
  //     await this.userRepository.increment({ id: user.id }, 'pswTimes', 1);
  //     throw new UnauthorizedException(
  //       `密码已连续输错${user.pswTimes + 1}次，超过5次将锁定！`,
  //     );
  //   }
  //   // 不是首次登录时的处理
  //   if (user.firstLoginAt) {
  //     await this.userRepository.update(user.id, {
  //       pswTimes: 0,
  //       loginTimes: user.loginTimes + 1,
  //       lastLoginIp: loginIp,
  //       lastLoginAt: Date.now(),
  //       lastSessionAt: Date.now(),
  //     });
  //   }
  //   // 首次登录时的处理
  //   else {
  //     await this.userRepository.update(user.id, {
  //       pswTimes: 0,
  //       loginTimes: user.loginTimes + 1,
  //       firstLoginAt: Date.now(),
  //       lastLoginIp: loginIp,
  //       lastLoginAt: Date.now(),
  //       lastSessionAt: Date.now(),
  //     });
  //   }
  //   return user;
  // }

  // /**
  //  * 更新用户登陆时间及IP地址
  //  * @param id 用户ID
  //  */
  // async logined(id: number, loginIp: string): Promise<void> {
  //   const at = Date.now();
  //   await this.userRepository.update(id, {
  //     lastLoginAt: at,
  //     lastLoginIp: loginIp,
  //     lastSessionAt: at,
  //   });
  //   await this.userRepository.increment({ id }, 'loginTimes', 1);
  // }

  // /**
  //  * 更新用户最后会话时间
  //  * @param id 用户ID
  //  */
  // async session(id: number): Promise<void> {
  //   await this.userRepository.update(id, { lastSessionAt: Date.now() });
  // }

  // /**
  //  * 修改登陆名
  //  * @param id 用户ID
  //  * @param loginName 新登陆名
  //  * @param update 更新信息
  //  * @returns 响应报文
  //  */
  // async change(
  //   id: number,
  //   loginName: string,
  //   update: UpdateEntity,
  // ): Promise<number> {
  //   // 判断登陆名是否已被使用
  //   if (
  //     Array.from(this.cache.values()).some(
  //       (item) => item.loginName === loginName,
  //     )
  //   ) {
  //     throw new ForbiddenException('登陆名已被使用');
  //   }
  //   /**更新结果 */
  //   const result = await this.userRepository.update(id, { loginName, update });
  //   if (result.affected) {
  //     this.updateSub.next(Number(update.operateId));
  //   }
  //   return result.affected;
  // }

  // /**
  //  * 修改密码
  //  *
  //  * 因为密码未保存在缓存中，所以密码修改不触发更新缓存
  //  * @param id 用户ID
  //  * @param oldpsw 原密码
  //  * @param newpsw 新密码
  //  * @param update 更新信息
  //  * @returns
  //  */
  // async secure(
  //   id: number,
  //   oldpsw: string,
  //   newpsw: string,
  //   update: UpdateEntity,
  // ): Promise<number> {
  //   // 因为密码没有保存在缓存中，所以需要重数据库中获取
  //   /**用户信息 */
  //   const user = await this.userRepository.findOne({
  //     select: [
  //       'password',
  //       'locked',
  //       'pswTimes',
  //     ] as FindOptionsSelect<UserEntity>,
  //     where: { id },
  //   });
  //   if (user.locked) {
  //     throw new ForbiddenException('账号已被锁定，请联系管理员解锁！');
  //   }
  //   /**密码验证结果 */
  //   const check = await compare(oldpsw, user.password);
  //   if (!check) {
  //     const pswTimes = user.pswTimes + 1;
  //     if (pswTimes >= 5) {
  //       await this.userRepository.update(id, {
  //         locked: true,
  //         pswTimes,
  //         update,
  //       });
  //       throw new BadRequestException(
  //         `已输错${pswTimes}次密码，账号已被锁定！`,
  //       );
  //     } else {
  //       await this.userRepository.update(id, { pswTimes, update });
  //       throw new BadRequestException(
  //         `已输错${pswTimes}次密码，超过5次账号将被锁定！`,
  //       );
  //     }
  //   }
  //   /**新密码盐 */
  //   const salt = await genSalt();
  //   /**新密码密文 */
  //   const password = await hash(newpsw, salt);
  //   /**设置新密码结果 */
  //   const result = await this.userRepository.update(id, { password, update });
  //   if (result.affected) {
  //     this.updateSub.next(Number(update.operateId));
  //   }
  //   return result.affected;
  // }

  // /**
  //  * 解锁用户
  //  * @param user 待解锁的用户
  //  * @param id 待解锁的用户ID
  //  * @param update 更新信息
  //  * @returns 响应报文
  //  */
  // async unlock(ids: number[], update: UpdateEntity): Promise<number> {
  //   // 获取需要更新的对象ID集合
  //   ids = this.list()
  //     .filter((common) => ids.includes(common.id) && common.locked)
  //     .map((common) => common.id);
  //   const result = await this.userRepository.update(ids, {
  //     locked: false,
  //     pswTimes: 0,
  //     update,
  //   });
  //   if (result.affected) {
  //     this.updateSub.next(Number(update.operateId));
  //   }
  //   return result.affected;
  // }

  // /**
  //  * 重置用户密码
  //  * @param id 待重置密码的用户ID
  //  * @param newpsw 新密码明文
  //  * @param update 更新信息
  //  * @returns 响应报文
  //  */
  // async resetpsw(
  //   id: number,
  //   newpsw: string,
  //   update: UpdateEntity,
  // ): Promise<number> {
  //   /**密码盐 */
  //   const salt = await genSalt();
  //   /**密码密文 */
  //   const password = await hash(newpsw, salt);
  //   /**更新用户结果 */
  //   const result = await this.userRepository.update(id, { password, update });
  //   if (result.affected) {
  //     this.updateSub.next(Number(update.operateId));
  //   }
  //   return result.affected;
  // }

  /**
   * 设置拥有角色的用户清单
   *
   * 根据角色ID，设置拥有角色的用户ID清单
   * @param id 角色ID
   * @param ids 需要授权的用户ID数组
   * @param userId 更新用户ID
   * @param reqId 请求日志ID
   * @returns 响应报文
   */
  async grant(
    id: number,
    ids: number[],
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
