// 外部依赖
import { Inject } from '@nestjs/common';
import {
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

// 内部依赖
import { Ability, AbilityService } from '..';

// DONE:已完成检查

/**
 * 控制器基类
 *
 * 用于配置通用的swagger配置
 */
@ApiHeader({
  name: 'token',
  description: '用户令牌',
  required: true,
  example: 'abcdefg',
})
@ApiUnauthorizedResponse({
  description: '未授权',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '用户令牌验证无效' },
      error: { type: 'string', example: 'Unauthorized' },
      statusCode: { type: 'number', example: 401 },
    },
  },
})
@ApiForbiddenResponse({
  description: '禁止访问',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '用户未授权使用该接口' },
      error: { type: 'string', example: 'Forbidden' },
      statusCode: { type: 'number', example: 403 },
    },
  },
})
@ApiNotFoundResponse({
  description: '未找到相关资源',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '未找到相关资源' },
      error: { type: 'string', example: 'NotFound' },
      statusCode: { type: 'number', example: 404 },
    },
  },
})
export class BaseController {
  /**权限点服务 */
  @Inject() protected readonly abilitySrv: AbilityService;

  /**
   * 初始化权限点
   * @param moduleName 模块名称
   * @param controllerName 控制器名称
   * @param moduleAbility 模块权限点
   * @param ControllerAbility 控制器权限点
   * @param action 方法权限点配置
   */
  protected init(
    moduleName: string,
    controllerName: string,
    moduleAbility: number,
    controllerAbility: number,
    action: { id: number; name: string; description: string }[],
  ): void {
    // 增加控制器权限点
    this.abilitySrv.add({
      id: controllerAbility,
      pid: moduleAbility,
      name: controllerName,
      description: `${controllerName}控制器，一般用于子菜单页面显示`,
      moduleName: moduleName,
      controllerName,
      type: '控制器',
    });
    // 增加方法权限点
    this.abilitySrv.add(
      ...action.map(
        (item) =>
          ({
            pid: controllerAbility,
            moduleName,
            controllerName,
            type: '方法',
            ...item,
          }) as Ability,
      ),
    );
  }
}
