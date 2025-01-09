// 外部依赖
import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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

// DONE:已完成检查

/**角色控制器 */
@Controller('auth/role')
@ApiTags('访问控制-角色')
@Abilities(120)
export class RoleController extends CommonController<
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
  @Post('users/:id')
  @Abilities(8)
  private async grant(
    @Body(ParseArrayPipe) ids: number[],
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.userSrv.grant(ids, id, userId, reqId);
  }
}
