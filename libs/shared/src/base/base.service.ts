// 外部依赖
import { Inject } from '@nestjs/common';

// 内部依赖
import { UpdateEntity, OperateService } from '..';

/**基础服务 */
export class BaseService {
  /**操作序号服务 */
  @Inject() protected readonly operateSrv: OperateService;

  /**
   * 获取更新信息
   * @param name 操作对象
   * @param operate 操作类型
   * @param userId 操作用户ID，默认1
   * @param reqId 请求ID，默认0
   * @returns 更新信息
   */
  protected async getUpdate(
    name: string,
    operate: string,
    userId: number = 1,
    reqId: number = 0,
  ): Promise<UpdateEntity> {
    /**当前时间 */
    const at = Date.now();
    /**操作序号 */
    const operateId = await this.operateSrv.create(name, operate);
    // 返回更新信息
    return {
      userId,
      at,
      operateId,
      operate,
      reqId,
    } as UpdateEntity;
  }
}
