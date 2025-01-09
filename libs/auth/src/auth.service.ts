// 外部依赖
import { Injectable } from '@nestjs/common';

// 内部依赖
import { Ability, AbilityService } from '.';

// DONE:已完成检查

/**访问控制服务 */
@Injectable()
export class AuthService {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   */
  constructor(private readonly abilitySrv: AbilityService) {
    this.abilitySrv.add({
      id: 100,
      pid: 0,
      name: '访问控制',
      description: '访问控制模块，一般用于主菜单链接显示',
      moduleName: '访问控制',
      type: '模块',
    } as Ability);
  }
}
