// 外部依赖
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// 内部依赖

import {
  RoleDto,
  RoleEntity,
  RoleLogEntity,
  RoleService,
  UserService,
  Abilities,
  CommonController,
} from '..';

/**角色控制器 */
@Controller('auth/role')
@ApiTags('访问控制-角色')
@Abilities(120)
export class RoleController extends CommonController<
  number,
  RoleDto,
  RoleDto,
  RoleEntity,
  RoleLogEntity
> {
  /**
   * 构造函数
   * @param roleSrv 角色服务
   * @param userSrv 用户服务
   */
  constructor(
    private readonly roleSrv: RoleService,
    private readonly userSrv: UserService,
  ) {
    super(roleSrv, '访问控制', '角色', 100, 120);
  }

  /**
   * 批量调整拥有某角色的用户
   * @param id 角色ID
   * @param ids 需要授权的用户ID数组
   * @param res 响应上下文
   */
  // @Post('users/:id')
  // @Auth(8)
  // private async grant(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body(ParseArrayPipe) ids: number[],
  //   @Res() res: Response,
  // ): Promise<void> {
  //   res.locals.result = await this.userSrv.grant(
  //     id,
  //     ids,
  //     res.locals.update as UpdateEntity,
  //   );
  // }
}
