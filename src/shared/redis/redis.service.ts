// 外部依赖
import { Injectable } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

/**缓存服务（Redis） */
@Injectable()
export class RedisService extends Redis {
  /**构造函数 */
  constructor() {
    // 进行配置参数验证
    if (!process.env.REDIS_HOST) {
      throw new Error('未配置缓存地址');
    }
    /**缓存地址 */
    const host = process.env.REDIS_HOST;
    /**缓存端口 */
    const port = parseInt(process.env.REDIS_PORT, 10) || 6379;
    /**缓存数据库 */
    const db = parseInt(process.env.REDIS_DB, 10) || 0;
    /**缓存密码 */
    const password = process.env.REDIS_PSW || '';
    /**缓存配置 */
    const options = { host, port, db, password } as RedisOptions;
    console.debug('应用缓存已连接');
    super(options);
  }
}
