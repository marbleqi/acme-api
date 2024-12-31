// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { Ability } from '..';

/**权限点服务 */
@Injectable()
export class AbilityService {
  /**权限点缓存 */
  private abilityMap: Map<number, Ability>;

  /**构造函数 */
  constructor() {
    this.abilityMap = new Map<number, Ability>();
  }

  /**
   * 添加权限点
   * @param abilities 添加的权限点
   */
  add(...abilities: Ability[]): void {
    for (const ability of abilities) {
      this.abilityMap.set(ability.id, ability);
    }
  }

  /**
   * 获取权限点清单
   * @returns 权限点清单
   */
  index(): Ability[] {
    return Array.from(this.abilityMap.values());
  }

  /**
   * 获取权限点数量
   * @returns 权限点数量
   */
  get size(): number {
    return this.abilityMap.size;
  }

  /**
   * 获取权限点详情
   * @param id 权限点ID
   * @returns 权限点对象
   */
  show(id: number): Ability {
    return this.abilityMap.get(id);
  }
}
