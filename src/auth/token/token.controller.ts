// 外部依赖
import {
  Controller,
  Res,
  Param,
  Get,
  Delete,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
// 内部依赖
import { Abilities, TokenService, BaseController } from '..';

/**令牌控制器 */
@Controller('auth/token')
@ApiTags('访问控制-令牌')
@Abilities(170)
export class TokenController
  extends BaseController
  implements OnApplicationBootstrap
{
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   * @param tokenSrv 令牌服务
   */
  constructor(private readonly tokenSrv: TokenService) {
    super();
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    const action = [
      { id: 171, name: '令牌列表', description: '查看令牌列表' },
      { id: 176, name: '作废令牌', description: '强制令牌失效' },
    ];
    this.init('访问控制', '权限点', 100, 170, action);
  }
  /**
   * 获取令牌清单
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取令牌清单' })
  @ApiOkResponse({ description: '获取权限点详情成功' })
  @Abilities(1)
  private async index(@Res() res: Response): Promise<void> {
    res.locals.result = await this.tokenSrv.index();
  }

  /**
   * 令牌作废
   * @param token 待作废的令牌
   * @param res 响应上下文
   */
  @Delete('destroy/:token')
  @ApiOperation({ summary: '令牌作废' })
  @ApiParam({ name: 'token', description: '令牌', example: 'abcdefg' })
  @ApiOkResponse({ description: '令牌作废成功', type: Number })
  @Abilities(6)
  private async destroy(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.tokenSrv.destroy(token);
  }
}
