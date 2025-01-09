// 外部依赖
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  Res,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

// 内部依赖
import { Ability, Abilities, RoleService, BaseController } from '..';

// DONE:已完成检查

/**权限点控制器 */
@Controller('auth/ability')
@ApiTags('访问控制-权限点')
@Abilities(110)
export class AbilityController
  extends BaseController
  implements OnApplicationBootstrap
{
  /**
   * 构造函数
   * @param roleSrv 角色服务
   */
  constructor(private readonly roleSrv: RoleService) {
    super();
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    const action = [
      { id: 111, name: '权限点列表', description: '查看权限点列表' },
      { id: 112, name: '权限点详情', description: '查看权限点详情' },
      {
        id: 113,
        name: '权限点批量授权',
        description: '批量调整拥有某权限点的角色',
      },
    ];
    this.init('访问控制', '权限点', 100, 110, action);
  }

  /**
   * 获取权限点清单
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取权限点清单' })
  @ApiOkResponse({ description: '获取实例清单成功', type: [Ability] })
  @Abilities(1)
  private index(@Res() res: Response) {
    res.locals.result = this.abilitySrv.index();
  }

  /**
   * 获取权限点详情
   * @param id 权限点ID
   * @param res 响应上下文
   */
  @Get('show/:id')
  @ApiOperation({ summary: '获取权限点详情' })
  @ApiParam({ name: 'id', description: '权限点ID', example: 100 })
  @ApiOkResponse({ description: '获取权限点详情成功', type: Ability })
  @Abilities(2)
  private show(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.locals.result = this.abilitySrv.show(id);
  }

  /**
   * 批量调整拥有某权限点的角色
   * @param ids 角色ID数组
   * @param id 权限点ID
   * @param res 响应上下文
   */
  @Post('role/:id')
  @ApiOperation({ summary: '批量调整拥有某权限点的角色' })
  @ApiParam({ name: 'id', description: '权限点ID', example: 100 })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      example: [1, 2, 3],
      description: '授权的角色ID数组',
    },
  })
  @ApiOkResponse({
    description: '批量调整角色权限点成功',
    schema: { type: 'number', example: 5, description: '更新角色记录数' },
  })
  @Abilities(3)
  private async role(
    @Body(ParseArrayPipe) ids: number[],
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.roleSrv.grant(ids, id, userId, reqId);
  }
}
