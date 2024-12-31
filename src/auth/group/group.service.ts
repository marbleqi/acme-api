// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { CommonService } from '@shared';
import { GroupDto, GroupEntity, GroupLogEntity } from '..';

/**用户组服务 */
@Injectable()
export class GroupService extends CommonService<
  number,
  GroupDto,
  GroupDto,
  GroupEntity,
  GroupLogEntity
> {
  /**
   * 构造函数
   * @param groupRepository 用户组存储器
   * @param groupLogRepository 用户组日志存储器
   */
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupLogEntity)
    private readonly groupLogRepository: Repository<GroupLogEntity>,
  ) {
    super('id', 'group', '用户组', groupRepository, groupLogRepository);
  }
}
