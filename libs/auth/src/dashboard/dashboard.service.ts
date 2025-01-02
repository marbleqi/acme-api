// 外部依赖
import { Injectable } from '@nestjs/common';

// 内部依赖
import { RedisService } from '@shared';
import {
  // MenuEntity,
  // CategoryEntity,
  // RoleEntity,
  // UserEntity,
  // GroupEntity,
  AbilityService,
} from '..';

@Injectable()
export class DashboardService {
  /**
   * 构造函数
   * @param entityManager 实体管理器
   * @param commonService 通用服务
   */
  // constructor(
  //   private readonly redisService: RedisService,
  //   private readonly abilitySrv: AbilityService,
  // ) {}
  // ability() {
  //   return this.abilitySrv.size;
  // }
  // async menu() {
  //   /**返回的模块记录 */
  //   const result = await this.entityManager
  //     .createQueryBuilder()
  //     .from(MenuEntity, 'menu')
  //     .select('COUNT(0)', 'count')
  //     .getRawOne();
  //   console.log('menu', result);
  //   return result
  //     ? ({ code: 0, msg: 'ok', data: result.count })
  //     : ({ code: 404, msg: '未获取到菜单数据' });
  // }
  // async category() {
  //   /**返回的模块记录 */
  //   const result = await this.entityManager
  //     .createQueryBuilder()
  //     .from(CategoryEntity, 'category')
  //     .select('COUNT(0)', 'count')
  //     .getRawOne();
  //   console.log('category', result);
  //   return result
  //     ? ({ code: 0, msg: 'ok', data: result.count })
  //     : ({ code: 404, msg: '未获取到菜单类别数据' });
  // }
  // async role() {
  //   /**返回的模块记录 */
  //   const result = await this.entityManager
  //     .createQueryBuilder()
  //     .from(RoleEntity, 'role')
  //     .select('COUNT(0)', 'count')
  //     .getRawOne();
  //   console.log('role', result);
  //   return result
  //     ? ({ code: 0, msg: 'ok', data: result.count })
  //     : ({ code: 404, msg: '未获取到角色数据' });
  // }
  // async user() {
  //   /**返回的模块记录 */
  //   const result = await this.entityManager
  //     .createQueryBuilder()
  //     .from(UserEntity, 'user')
  //     .select('COUNT(0)', 'count')
  //     .getRawOne();
  //   console.log('user', result);
  //   return result
  //     ? ({ code: 0, msg: 'ok', data: result.count })
  //     : ({ code: 404, msg: '未获取到用户数据' });
  // }
  // async group() {
  //   /**返回的模块记录 */
  //   const result = await this.entityManager
  //     .createQueryBuilder()
  //     .from(GroupEntity, 'group')
  //     .select('COUNT(0)', 'count')
  //     .getRawOne();
  //   console.log('group', result);
  //   return result
  //     ? ({ code: 0, msg: 'ok', data: result.count })
  //     : ({ code: 404, msg: '未获取到用户组数据' });
  // }
  // async token() {
  //   /**令牌清单 */
  //   const tokens = await this.redisService.keys('token:*');
  //   // 返回令牌数量
  //   return { code: 0, msg: 'ok', data: tokens.length };
  // }
}
