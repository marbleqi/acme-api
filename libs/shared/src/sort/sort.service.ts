// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { SortEntity, SortLogEntity, CommonService } from '..';

/**排序服务 */
@Injectable()
export class SortService extends CommonService<
  string,
  any,
  any,
  SortEntity,
  SortLogEntity
> {
  /**
   * 构造函数
   * @param sortRepository 排序存储器
   * @param sortLogRepository 排序日志存储器
   */
  constructor(
    @InjectRepository(SortEntity)
    private readonly sortRepository: Repository<SortEntity>,
    @InjectRepository(SortLogEntity)
    private readonly sortLogRepository: Repository<SortLogEntity>,
  ) {
    super('code', 'sort', '排序值', sortRepository, sortLogRepository);
  }
}
