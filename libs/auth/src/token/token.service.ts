// 外部依赖
import { Injectable, UnauthorizedException } from '@nestjs/common';

// 内部依赖
import { random, RedisService, SettingService } from '@shared';

// TODO：已完成相关逻辑编写，但尚未经过验证

/**
 * 令牌服务
 *
 * 令牌属于经常被使用，而且修改频繁的对象
 * 后端采用Redis存储的方式（以支持多后端实例同时运行的情况）
 */
@Injectable()
export class TokenService {
  /**
   * 构造函数
   * @param redisSrv 共享缓存服务
   */
  constructor(
    private readonly redisSrv: RedisService,
    private readonly settingSrv: SettingService,
  ) {}

  /**
   * 获取令牌清单
   * @returns 令牌清单
   */
  async index(): Promise<Record<string, string>[]> {
    /**令牌清单 */
    const tokens = await this.redisSrv.keys('token:*');
    /**令牌数组 */
    const data: Record<string, string>[] = [];
    for (const item of tokens) {
      /**令牌 */
      const token = await this.redisSrv.hgetall(item);
      data.push(token);
    }
    return data;
  }

  /**
   * 获取令牌数量
   * @returns 令牌数量
   */
  async size(): Promise<number> {
    /**令牌清单 */
    const tokens = await this.redisSrv.keys('token:*');
    return tokens.length;
  }

  /**
   * 获取令牌详情
   * @param token 令牌
   * @returns 令牌详情
   */
  async show(token: string): Promise<Record<string, string>> {
    return await this.redisSrv.hgetall(`token:${token}`);
  }

  /**
   * 创建令牌
   *
   * 在任意一种认证方式通过后，统一的申请令牌处理
   * @param id 待申请令牌的用户ID
   * @returns 响应报文
   */
  async create(id: number) {
    /**系统配置 */
    const config = this.settingSrv.cache.get('system').config;
    console.debug('setting', config);
    /**令牌 */
    let tokenStr: string;
    /**令牌已存在标记 */
    let exists: number;
    do {
      tokenStr = random(40);
      exists = await this.redisSrv.exists(`token:${tokenStr}`);
    } while (exists);
    /**令牌过期时间 */
    const expired = Date.now() + Number(config.expired) * 60000 + 60000;
    const token = {
      id,
      token: tokenStr,
      expired,
      createAt: Date.now(),
      updateAt: Date.now(),
    };
    console.debug('token', token);
    // 缓存令牌
    await this.redisSrv.hmset(`token:${tokenStr}`, token);
    // 设置缓存有效期
    await this.redisSrv.pexpireat(`token:${tokenStr}`, expired);
    // 返回令牌信息
    return token;
  }

  /**
   * 刷新令牌，旧令牌换新令牌
   * @param oldToken 原令牌
   * @returns 消息报文
   */
  async refresh(oldToken: string) {
    /**新令牌 */
    let newToken: string;
    /**新令牌存在标记 */
    let exists: number;
    // 生成新令牌
    do {
      newToken = random(40);
      exists = await this.redisSrv.exists(`token:${newToken}`);
    } while (exists);
    /**更换令牌键值 */
    let result: number = await this.redisSrv.renamenx(
      `token:${oldToken}`,
      `token:${newToken}`,
    );
    // 令牌更新失败
    if (!result) {
      throw new UnauthorizedException(`新令牌生成失败`);
    }
    /**系统配置 */
    const config = this.settingSrv.cache.get('system').config;
    /**令牌过期时间 */
    const expired = Date.now() + Number(config.expired ?? 30) * 60000 + 60000;
    // 设置新令牌过期时间
    result = await this.redisSrv.pexpireat(`token:${newToken}`, expired);
    // 令牌过期时间更新失败
    if (!result) {
      throw new UnauthorizedException(`令牌更新失败`);
    }

    let token: any = await this.redisSrv.hgetall(`token:${newToken}`);
    /**令牌过期时间 */
    console.debug('tokenA', token);
    token = {
      id: Number(token.id),
      token: newToken,
      createAt: Number(token.createAt),
      expired,
      updateAt: Date.now(),
    };
    console.debug('tokenB', token);
    // 更新令牌值
    await this.redisSrv.hmset(`token:${newToken}`, token);
    // 返回新的令牌信息
    return token;
  }

  /**
   * 令牌作废
   * @param token 待作废的令牌
   * @returns 响应报文
   */
  async destroy(token: string): Promise<number> {
    return await this.redisSrv.del(`token:${token}`);
  }
}
