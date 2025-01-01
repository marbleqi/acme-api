// 外部依赖
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// 内部依赖
import {
  GroupDto,
  Abilities,
  GroupEntity,
  GroupLogEntity,
  GroupService,
  CommonController,
} from '..';

/**用户组控制器 */
@Controller('auth/group')
@ApiTags('访问控制-用户组')
@Abilities(120)
export class GroupController extends CommonController<
  number,
  GroupDto,
  GroupDto,
  GroupEntity,
  GroupLogEntity
> {
  /**
   * 构造函数
   * @param groupSrv 用户组服务
   */
  constructor(private readonly groupSrv: GroupService) {
    super(groupSrv, '访问控制', '用户组', 100, 120);
  }
}
