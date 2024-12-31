// 外部依赖
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
// 内部依赖
import { DashboardService } from '..';

@Controller('auth/dashboard')
export class DashboardController {
  /**
   * 构造函数
   * @param dashboardService 概览服务
   */
  constructor(private readonly dashboardService: DashboardService) {}

  // /**
  //  * 获取权限点统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('ability')
  // ability(@Res() res: Response) {
  //   res.locals.result = this.dashboardService.ability();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取菜单统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('menu')
  // async menu(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.menu();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取菜单类别统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('category')
  // async category(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.category();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取角色统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('role')
  // async role(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.role();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取用户统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('user')
  // async user(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.user();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取用户组统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('group')
  // async group(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.group();
  //   res.status(200).json(res.locals.result);
  // }

  // /**
  //  * 获取令牌统计数据
  //  * @param res 响应上下文
  //  */
  // @Get('token')
  // async token(@Res() res: Response) {
  //   res.locals.result = await this.dashboardService.token();
  //   res.status(200).json(res.locals.result);
  // }
}
