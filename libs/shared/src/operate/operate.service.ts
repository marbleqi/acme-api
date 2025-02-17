// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 内部依赖
import { OperateEntity, UpdateEntity } from '..';

/**操作序号服务 */
@Injectable()
export class OperateService {
  /**
   * 构造函数
   * @param operateRepository 操作序号存储器
   */
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
  ) {}

  /**
   * 获取新的操作序号
   * @param name 操作对象
   * @param operate 操作类型
   * @returns 新的操作序号
   */
  async operate(
    name: string,
    operate: string,
    userId: number,
    reqId: number,
  ): Promise<UpdateEntity> {
    /**当前时间 */
    const at = Date.now();
    /**当前操作序号对象 */
    const data = { name, operate, at } as OperateEntity;
    await this.operateRepository.insert(data);
    const operateId = data.id ? Number(data.id) : 0;
    // 返回更新信息
    return {
      userId,
      at,
      operateId,
      operate,
      reqId,
    } as UpdateEntity;
  }
}
