// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

// 内部依赖
import { ReqDto, ReqEntity } from '..';

/**请求日志服务 */
@Injectable()
export class ReqService {
  /**
   * 构造函数
   * @param reqRepository 日志存储器
   */
  constructor(
    @InjectRepository(ReqEntity)
    private readonly reqRepository: Repository<ReqEntity>,
  ) {}

  /**
   * 创建请求日志
   * @param data 请求日志数据
   * @returns 请求日志ID
   */
  async insert(data: ReqEntity): Promise<number> {
    await this.reqRepository.insert(data);
    return Number(data.reqId) || 0;
  }

  /**
   * 更新请求日志
   * @param reqId 请求日志ID
   * @param value 更新日志数据
   */
  async update(reqId: number, value: ReqEntity): Promise<void> {
    await this.reqRepository.update(reqId, value);
  }

  /**
   * 获取日志模块列表
   * @returns 模块列表
   */
  async module(): Promise<any[]> {
    /**返回的模块记录 */
    return await this.reqRepository
      .createQueryBuilder('req')
      .select('DISTINCT req.module', 'module')
      .getRawMany();
  }

  /**
   * 获取日志控制器列表
   * @param module 模块名
   * @returns 控制器列表
   */
  async controller(module: string): Promise<any[]> {
    /**返回的控制器记录 */
    return await this.reqRepository
      .createQueryBuilder('req')
      .select('DISTINCT req.controller', 'controller')
      .where('req.module = :module', { module })
      .getRawMany();
  }

  /**
   * 获取方法列表
   * @param module 模块名
   * @param controller 控制器名
   * @returns 方法列表
   */
  async action(module: string, controller: string): Promise<any[]> {
    return await this.reqRepository
      .createQueryBuilder('req')
      .select('DISTINCT req.action', 'action')
      .where('req.module = :module AND req.controller = :controller', {
        module,
        controller,
      })
      .getRawMany();
  }

  /**
   * 搜索请求日志记录
   * @param value 请求日志搜索条件
   * @param reqId 当前请求ID（去除当前日志ID）
   * @returns 日志记录
   */
  async index(value: ReqDto, reqId: number): Promise<any[]> {
    /**请求日志查询对象 */
    let query: SelectQueryBuilder<ReqEntity>;
    // 初始化查询对象
    query = this.reqRepository
      .createQueryBuilder('req')
      .setFindOptions({
        select: [
          'reqId',
          'userId',
          'module',
          'controller',
          'action',
          'status',
          'clientIp',
          'serverIp',
          'startAt',
          'endAt',
        ],
      })
      .where('req.req_id != :reqId', { reqId });
    // 搜索条件增加用户ID
    if (value.userId && Number(value.userId)) {
      query = query.andWhere('req.user_id != :userId', {
        userId: Number(value.userId),
      });
    }
    // 搜索条件增加模块
    if (value.module) {
      query = query.andWhere('req.module != :module', {
        module: value.module,
      });
    }
    // 搜索条件增加控制器
    if (value.controller) {
      query = query.andWhere('req.controller != :controller', {
        controller: value.controller,
      });
    }
    // 搜索条件增加方法
    if (value.action) {
      query = query.andWhere('req.action != :action', {
        action: value.action,
      });
    }
    // 搜索条件增加状态码
    if (value.status === 200) {
      query = query.andWhere('req.status >= 200');
      query = query.andWhere('req.status < 300');
    } else if (value.status === 300) {
      query = query.andWhere('req.status >= 300');
      query = query.andWhere('req.status < 400');
    } else if (value.status === 400) {
      query = query.andWhere('req.status >= 400');
      query = query.andWhere('req.status < 500');
    } else if (value.status === 500) {
      query = query.andWhere('req.status >= 500');
      query = query.andWhere('req.status < 600');
    }
    // 搜索条件请求时间
    if (value.startAt) {
      query = query.andWhere('req.start_at >= :startAt', {
        startAt: Number(value.startAt),
      });
    }
    // 搜索条件响应时间
    if (value.endAt) {
      query = query.andWhere('req.endAt <= :endAt', {
        endAt: Number(value.endAt),
      });
    }
    return await query.getMany();
  }

  /**
   * 获取日志详情
   * @param reqId 日志ID
   * @returns 响应报文
   */
  async show(reqId: number) {
    return await this.reqRepository.findOneBy({ reqId });
  }
}
