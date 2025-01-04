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
import { BaseService } from '@shared';
import { UserEntity, UserLogEntity } from '@auth';
import { LoginDto } from '.';

@Injectable()
export class PassportService extends BaseService {
  /**
   * 构造函数
   * @param userRepository 用户存储器
   * @param userLogRepository 用户日志存储器
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  /**
   * 用户登陆
   * @param loginName 登陆名
   * @param loginPsw 登陆密码
   * @param loginIp 用户IP
   * @returns 登陆用户
   */
  async login(config: LoginDto, loginIp: string): Promise<UserEntity> {
    /**用户对象 */
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'config.loginName',
        'config.name',
        'config.password',
        'config.status',
        'config.locked',
        'pswTimes',
        'loginTimes',
        'firstLoginAt',
      ] as FindOptionsSelect<UserEntity>,
      where: { config: { loginName: config.loginName } },
    });
    console.debug('config', config);
    console.debug('loginIp', loginIp, loginIp.length);
    console.debug('userA', user);
    // 判断用户是否存在
    if (!user) {
      throw new UnauthorizedException(`该用户不存在！`);
    }
    console.debug('已判断用户存在');
    // 判断用户启用状态
    if (!user.config.status) {
      throw new UnauthorizedException(`用户${user.config.name}账号已被禁用！`);
    }
    // 判断用户锁定状态
    console.debug('已判断用户有效');
    if (user.config.locked) {
      throw new UnauthorizedException(`用户${user.config.name}账号已被锁定！`);
    }
    console.debug('已判断用户允许密码登录');
    console.debug(
      '开始判断密码是否一致',
      config.loginPsw,
      user.config.password,
    );
    /**判断密码是否一致 */
    const check = compareSync(config.loginPsw, user.config.password);
    console.debug('判断密码是否一致check', check);
    // 判断密码密文是否一致
    if (!check) {
      // 密码密文不一致，密码错误计数加1
      await this.userRepository.increment({ id: user.id }, 'pswTimes', 1);
      throw new UnauthorizedException(
        `密码已连续输错${user.pswTimes + 1}次，超过5次将锁定！`,
      );
    }
    // 不是首次登录时的处理
    if (user.firstLoginAt) {
      // 更新字段不包括首次登陆时间
      await this.userRepository.update(user.id, {
        pswTimes: 0,
        loginTimes: user.loginTimes + 1,
        lastLoginIp: loginIp,
        lastLoginAt: Date.now(),
        lastSessionAt: Date.now(),
      });
    }
    // 首次登录时的处理
    else {
      // 更新字段包括首次登陆时间
      await this.userRepository.update(user.id, {
        pswTimes: 0,
        loginTimes: user.loginTimes + 1,
        firstLoginAt: Date.now(),
        lastLoginIp: loginIp,
        lastLoginAt: Date.now(),
        lastSessionAt: Date.now(),
      });
    }
    return user;
  }
}
