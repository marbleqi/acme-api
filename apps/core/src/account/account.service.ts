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

@Injectable()
export class AccountService extends BaseService {
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
   * 修改密码
   *
   * 因为密码未保存在缓存中，所以密码修改不触发更新缓存
   * @param id 用户ID
   * @param oldpsw 原密码
   * @param newpsw 新密码
   * @returns 修改记录数
   */
  async secure(id: number, oldpsw: string, newpsw: string): Promise<number> {
    // 因为密码没有保存在缓存中，所以需要重数据库中获取
    /**用户信息 */
    const user = await this.userRepository.findOne({
      select: [
        'password',
        'locked',
        'pswTimes',
      ] as FindOptionsSelect<UserEntity>,
      where: { id },
    });
    if (user.config.locked) {
      throw new ForbiddenException('账号已被锁定，请联系管理员解锁！');
    }
    /**密码验证结果 */
    const check = await compare(oldpsw, user.config.password);
    if (!check) {
      const pswTimes = user.pswTimes + 1;
      if (pswTimes >= 5) {
        await this.userRepository.update(id, {
          config: { locked: true },
          pswTimes,
        });
        throw new BadRequestException(
          `已输错${pswTimes}次密码，账号已被锁定！`,
        );
      } else {
        await this.userRepository.update(id, { pswTimes });
        throw new BadRequestException(
          `已输错${pswTimes}次密码，超过5次账号将被锁定！`,
        );
      }
    }
    /**新密码盐 */
    const salt = await genSalt();
    /**新密码密文 */
    const password = await hash(newpsw, salt);
    /**设置新密码结果 */
    const result = await this.userRepository.update(id, {
      config: { password },
    });
    return result.affected;
  }
}
