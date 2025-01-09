// 外部依赖
import { ApiProperty } from '@nestjs/swagger';

// DONE:已完成检查

/**权限点 */
export class Ability {
  /**权限点ID */
  @ApiProperty({ description: '权限点ID', example: 1 })
  id: number;

  /**上级权限点ID */
  @ApiProperty({ description: '上级权限点ID', example: 1 })
  pid: number;

  /**权限点名称 */
  @ApiProperty({ description: '权限点名称', example: '权限点名称' })
  name: string;

  /**权限点说明 */
  @ApiProperty({ description: '权限点说明', example: '权限点说明' })
  description: string;

  /**所属模块 */
  @ApiProperty({ description: '所属模块', example: '访问控制' })
  moduleName: string;

  /**所属控制器 */
  @ApiProperty({ description: '所属控制器', example: '权限点' })
  controllerName?: string;

  /**权限点类型 */
  @ApiProperty({ description: '权限点类型', example: '模块' })
  type: '模块' | '控制器' | '方法';
}
