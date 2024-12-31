// 外部依赖
import {
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
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
 * 用于配置通用的swagger配置
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
  moduleName: string;
  controllerName: string;
  moduleAbility: number;
  controllerAbility: number;

  /**
   * 构造函数
   * @param commonService 依赖的服务
   * @param moduleName 模块名称
   * @param controllerName 控制器名称
   * @param moduleAbility 模块权限点
   * @param ControllerAbility 控制器权限点
   */
  constructor(
    private readonly commonService: CommonService<
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
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    /**方法权限点 */
    const action = [
      {
        id: this.controllerAbility + 1,
        name: `${this.controllerName}列表`,
        description: `查看${this.controllerName}列表`,
      },
      {
        id: this.controllerAbility + 2,
        name: `${this.controllerName}详情`,
        description: `查看${this.controllerName}详情`,
      },
      {
        id: this.controllerAbility + 3,
        name: `${this.controllerName}日志`,
        description: `查看${this.controllerName}配置变更日志`,
      },
      {
        id: this.controllerAbility + 4,
        name: `刷新${this.controllerName}`,
        description: `刷新${this.controllerName}缓存`,
      },
      {
        id: this.controllerAbility + 5,
        name: `创建${this.controllerName}`,
        description: `创建新的${this.controllerName}`,
      },
      {
        id: this.controllerAbility + 6,
        name: `更新${this.controllerName}`,
        description: `更新${this.controllerName}配置`,
      },
      {
        id: this.controllerAbility + 7,
        name: `更新${this.controllerName}状态`,
        description: `批量更新${this.controllerName}状态`,
      },
    ];
    // 初始化控制器权限点
    this.init(
      this.moduleName,
      this.controllerName,
      this.moduleAbility,
      this.controllerAbility,
      action,
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
    res.locals.result = await this.commonService.index(operateId);
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
    res.locals.result = await this.commonService.show(pk);
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
    res.locals.result = await this.commonService.log(pk);
  }

  /**
   * 重置对象缓存
   * @param res 响应上下文
   */
  @Post('reset')
  @ApiOperation({ summary: '重置对象缓存' })
  @Abilities(4)
  private async reset(@Res() res: Response): Promise<void> {
    res.locals.result = await this.commonService.reset();
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
    res.locals.result = await this.commonService.create(config, userId, reqId);
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
    res.locals.result = await this.commonService.update(
      pk,
      config,
      userId,
      reqId,
    );
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
    res.locals.result = await this.commonService.status(
      pks,
      status,
      userId,
      reqId,
    );
  }
}
