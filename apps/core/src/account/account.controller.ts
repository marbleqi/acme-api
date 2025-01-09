// 外部依赖
import {
  Controller,
  Get,
  Post,
  Headers,
  Query,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
// 内部依赖
import {
  UpdateEntity,
  SettingEntity,
  SettingService,
  OperatePipe,
} from '@shared';
import { RoleService, UserService, TokenService, BaseController } from '@auth';

@Controller('account')
@ApiTags('个人用户')
export class AccountController extends BaseController {
  /**
   * 构造函数
   * @param tokenSrv 注入的令牌服务
   * @param initService 注入的初始化服务
   */
  constructor(
    private readonly settingSrv: SettingService,
    private readonly tokenSrv: TokenService,
    private readonly roleSrv: RoleService,
    private readonly userSrv: UserService,
  ) {
    super();
  }
  /**
   * 前端启动初始化时调用的应用初始化接口
   * @param tokenStr 令牌
   * @param res 响应上下文
   */
  @Get('startup')
  @ApiOperation({ summary: '应用初始化' })
  @ApiOkResponse({
    description: '应用初始化成功',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: '用户信息',
          properties: { id: { type: 'number' }, name: { type: 'string' } },
        },
        app: { type: 'object', description: '应用信息', properties: {} },
        ability: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
          description: '授权权限点',
        },
      },
    },
  })
  private async startup(@Res() res: Response): Promise<void> {
    /**系统信息 */
    const system: SettingEntity = this.settingSrv.cache.get('system');
    const app = system.config;
    console.debug('app', app);
    // 获取用户信息
    const user = this.userSrv.cache.get(res.locals.userId);
    const ability = this.userSrv.ability(res.locals.userId);
    // const users = this.users(-1);
    console.debug('user', user);
    console.debug('ability', ability);
    // console.debug('users', users);
    // res.locals.result = { user, app, ability, users };
    res.locals.result = { user, app, ability };
  }
}
