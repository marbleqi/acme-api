// 外部依赖
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseBoolPipe,
  ParseArrayPipe,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

// 内部依赖
import { OperatePipe } from '@shared';
import { KeyDto, KeyService } from '..';

@Controller('key')
export class KeyController {
  constructor(private readonly keySrv: KeyService) {}
  /**
   * 获取对象清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取对象清单' })
  @ApiQuery({
    name: 'operateId',
    description: '操作序号，用于获取增量数据',
    required: false,
    example: 0,
  })
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    console.debug('operateId', operateId);
    res.locals.result = await this.keySrv.index(operateId);
  }

  /**
   * 获取对象详情
   * @param pk 对象主键值
   * @param res 响应上下文
   */
  @Get('show/:pk')
  @ApiOperation({ summary: '获取对象详情' })
  @ApiParam({
    name: 'pk',
    description: '对象主键值',
    required: true,
    example: 1,
  })
  private async show(
    @Param('pk') pk: number | string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.keySrv.show(pk);
  }

  /**
   * 获取对象变更日志
   * @param pk 对象主键值
   * @param res 响应上下文
   */
  @Get('log/:pk')
  @ApiOperation({ summary: '获取对象变更日志' })
  @ApiParam({
    name: 'pk',
    description: '对象主键值',
    required: true,
    example: 1,
  })
  private async log(
    @Param('pk') pk: number | string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.keySrv.log(pk);
  }

  /**
   * 创建对象
   * @param config 新对象信息
   * @param res 响应上下文
   */
  /**
   * 创建对象
   * @param config 新对象信息
   * @param res 响应上下文
   */
  @Post('create')
  @ApiOperation({ summary: '创建对象' })
  @ApiBody({ description: '新对象信息' })
  private async create(
    @Body() config: KeyDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals?.userId) || 1;
    const reqId = Number(res.locals?.reqId) || 0;
    res.locals.result = await this.keySrv.create(config, userId, reqId);
  }
  /**
   * 更新对象（含禁用）
   * @param pk 对象主键值
   * @param config 待更新信息
   * @param res 响应上下文
   */
  @Post('update/:pk')
  @ApiOperation({ summary: '更新对象（含禁用）' })
  @ApiBody({ description: '待更新信息' })
  private async update(
    @Param('pk') pk: number | string,
    @Body() config: KeyDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals?.userId) || 1;
    const reqId = Number(res.locals?.reqId) || 0;
    res.locals.result = await this.keySrv.update(pk, config, userId, reqId);
  }

  /**
   * 覆盖对象（有则更新，无则创建）
   * @param pk 对象主键值
   * @param config 待更新信息
   * @param res 响应上下文
   */
  @Post('upsert/:pk')
  @ApiOperation({ summary: '覆盖对象（有则更新，无则创建）' })
  private async upsert(
    @Param('pk') pk: number | string,
    @Body() config: KeyDto,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals?.userId) || 1;
    const reqId = Number(res.locals?.reqId) || 0;
    res.locals.result = await this.keySrv.upsert(pk, config, userId, reqId);
  }

  /**
   * 批量更新对象状态
   * @param pks 需要更新的对象主键值集合
   * @param status 待设置的对象状态
   * @param res 响应上下文
   */
  @Post('status')
  @ApiOperation({ summary: '批量更新对象状态' })
  private async status(
    @Body('pks', ParseArrayPipe) pks: number[] | string[],
    @Body('status', ParseBoolPipe) status: boolean,
    @Res() res: Response,
  ): Promise<void> {
    const userId = Number(res.locals?.userId) || 1;
    const reqId = Number(res.locals?.reqId) || 0;
    res.locals.result = await this.keySrv.status(pks, status, userId, reqId);
  }
}
