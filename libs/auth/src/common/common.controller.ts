// 外部依赖
import {
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseBoolPipe,
  ParseArrayPipe,
  Res,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ObjectLiteral } from 'typeorm';

// 内部依赖
import { CommonService, OperatePipe } from '@shared';
import { Abilities, BaseController } from '..';

/**
 * 通用控制器
 *
 * 用于配置通用的对象管理swagger配置
 *
 * @template pkType 主键类型，可以是 `number` 或 `string`。
 * @template CreateDto - 创建对象时使用的 DTO（数据传输对象）类型。
 * @template UpdateDto - 更新对象时使用的 DTO 类型。
 * @template Entity - 实体类型，必须是一个对象字面量。
 * @template EntityLog - 实体日志类型，必须是一个对象字面量。
 */
export class CommonController<
    pkType extends number | string,
    CreateDto,
    UpdateDto,
    Entity extends ObjectLiteral,
    EntityLog extends ObjectLiteral,
  >
  extends BaseController
  implements OnApplicationBootstrap
{
  /**模块名称 */
  moduleName: string;
  /**控制器名称 */
  controllerName: string;
  /**模块权限点 */
  moduleAbility: number;
  /**控制器权限点 */
  controllerAbility: number;
  /**方法权限点配置 */
  action: { id: number; name: string; description: string }[];

  /**
   * 构造函数
   * @param commonSrv 依赖的服务
   * @param moduleName 模块名称
   * @param controllerName 控制器名称
   * @param moduleAbility 模块权限点
   * @param ControllerAbility 控制器权限点
   */
  constructor(
    private readonly commonSrv: CommonService<
      pkType,
      CreateDto,
      UpdateDto,
      Entity,
      EntityLog
    >,
    moduleName: string,
    controllerName: string,
    moduleAbility: number,
    controllerAbility: number,
  ) {
    super();
    this.moduleName = moduleName;
    this.controllerName = controllerName;
    this.moduleAbility = moduleAbility;
    this.controllerAbility = controllerAbility;
    this.action = [
      {
        id: controllerAbility + 1,
        name: `${controllerName}列表`,
        description: `查看${controllerName}列表`,
      },
      {
        id: controllerAbility + 2,
        name: `${controllerName}详情`,
        description: `查看${controllerName}详情`,
      },
      {
        id: controllerAbility + 3,
        name: `${controllerName}日志`,
        description: `查看${controllerName}配置变更日志`,
      },
      {
        id: controllerAbility + 4,
        name: `刷新${controllerName}`,
        description: `刷新${controllerName}缓存`,
      },
      {
        id: controllerAbility + 5,
        name: `创建${controllerName}`,
        description: `创建新的${controllerName}`,
      },
      {
        id: controllerAbility + 6,
        name: `更新${controllerName}`,
        description: `更新${controllerName}配置`,
      },
      {
        id: controllerAbility + 7,
        name: `更新${controllerName}状态`,
        description: `批量更新${controllerName}状态`,
      },
    ];
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 初始化控制器权限点
    this.init(
      this.moduleName,
      this.controllerName,
      this.moduleAbility,
      this.controllerAbility,
      this.action,
    );
  }

  /**
   * 获取对象清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取对象清单' })
  @Abilities(1)
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.commonSrv.index(operateId);
  }

  /**
   * 获取对象详情
   * @param pk 对象主键值
   * @param res 响应上下文
   */
  @Get('show/:pk')
  @ApiOperation({ summary: '获取对象详情' })
  @Abilities(2)
  private async show(
    @Param('pk') pk: pkType,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.commonSrv.show(pk);
  }

  /**
   * 获取对象变更日志
   * @param pk 对象主键值
   * @param res 响应上下文
   */
  @Get('log/:pk')
  @ApiOperation({ summary: '获取对象变更日志' })
  @Abilities(3)
  private async log(
    @Param('pk') pk: pkType,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.commonSrv.log(pk);
  }

  /**
   * 重置对象缓存
   * @param res 响应上下文
   */
  @Post('reset')
  @ApiOperation({ summary: '重置对象缓存' })
  @Abilities(4)
  private async reset(@Res() res: Response): Promise<void> {
    await this.commonSrv.reset();
    res.locals.result = 'ok';
  }

  /**
   * 创建对象
   * @param config 新对象信息
   * @param res 响应上下文
   */
  @Post('create')
  @ApiOperation({ summary: '创建对象' })
  @Abilities(5)
  private async create(
    @Body() config: CreateDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.commonSrv.create(config, userId, reqId);
  }

  /**
   * 更新对象（含禁用）
   * @param pk 对象主键值
   * @param config 待更新信息
   * @param res 响应上下文
   */
  @Post('update/:pk')
  @ApiOperation({ summary: '更新对象（含禁用）' })
  @Abilities(6)
  private async update(
    @Param('pk') pk: pkType,
    @Body() config: UpdateDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.commonSrv.update(pk, config, userId, reqId);
  }

  /**
   * 覆盖对象（有则更新，无则创建）
   * @param pk 对象主键值
   * @param config 待更新信息
   * @param res 响应上下文
   */
  @Post('upsert/:pk')
  @ApiOperation({ summary: '覆盖对象（有则更新，无则创建）' })
  @Abilities(6)
  private async upsert(
    @Param('pk') pk: pkType,
    @Body() config: UpdateDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.commonSrv.upsert(pk, config, userId, reqId);
  }

  /**
   * 批量更新对象状态
   * @param pks 需要更新的对象主键值集合
   * @param status 待设置的对象状态
   * @param res 响应上下文
   */
  @Post('status')
  @ApiOperation({ summary: '批量更新对象状态' })
  @Abilities(7)
  private async status(
    @Body('pks', ParseArrayPipe) pks: number[] | string[],
    @Body('status', ParseBoolPipe) status: boolean,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals.userId);
    const reqId = Number(res.locals.reqId);
    res.locals.result = await this.commonSrv.status(pks, status, userId, reqId);
  }
}
