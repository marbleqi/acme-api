// 外部依赖
import {
  ForbiddenException,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
  ParseArrayPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// 内部依赖

import {
  UserDto,
  Abilities,
  UserEntity,
  UserLogEntity,
  UserService,
  CommonController,
} from '..';

/**用户控制器 */
@Controller('auth/user')
@ApiTags('访问控制-用户')
@Abilities(130)
export class UserController extends CommonController<
  number,
  UserDto,
  UserDto,
  UserEntity,
  UserLogEntity
> {
  /**
   * 构造函数
   * @param userSrv 用户服务
   */
  constructor(private readonly userSrv: UserService) {
    super(userSrv, '访问控制', '用户', 100, 130);
    // const action = [
    //   { id: 151, name: '用户列表', description: '查看用户列表' },
    //   { id: 152, name: '用户详情', description: '查看用户详情' },
    //   { id: 153, name: '用户历史', description: '用户更新历史' },
    //   { id: 154, name: '创建用户', description: '创建新的用户' },
    //   { id: 155, name: '更新用户', description: '更新用户信息' },
    //   { id: 156, name: '用户解锁', description: '对用户进行解锁' },
    //   { id: 157, name: '重置密码', description: '重置用户密码' },
    // ];
    // this.abilitySrv.add(
    //   ...[].map(
    //     (item) =>
    //       ({
    //         pid: 150,
    //         moduleName: '访问控制',
    //         objectName: '用户',
    //         type: '接口',
    //         ...item,
    //       }) as Ability,
    //   ),
    // );
  }

  /**
   * 解锁用户
   * @param user 现用户信息
   * @param res 响应上下文
   */
  // @Post('unlock')
  // @Abilities(156)
  // @Name('auth/user')
  // @Operate('unlock')
  // private async unlock(
  //   @Body('ids', ParseArrayPipe) ids: number[],
  //   @Res() res: Response,
  // ): Promise<void> {
  //   res.locals.result = await this.userSrv.unlock(
  //     ids,
  //     res.locals.update as UpdateEntity,
  //   );
  // }

  // /**
  //  * 重置用户密码
  //  * @param user 现用户信息
  //  * @param newPassword 新密码
  //  * @param res 响应上下文
  //  */
  // @Post('resetpsw')
  // @Abilities(157)
  // @Name('auth/user')
  // @Operate('resetpsw')
  // private async resetpsw(
  //   @Body('id', ParseIntPipe) id: number,
  //   @Body('newPassword') newPassword: string,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   res.locals.result = await this.userSrv.resetpsw(
  //     id,
  //     newPassword,
  //     res.locals.update as UpdateEntity,
  //   );
  //   // 将上下文的密码替换，避免将密码明文记入日志
  //   res.locals.request.body.newPassword = '************';
  // }
}
