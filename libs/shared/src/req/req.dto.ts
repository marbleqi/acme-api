// 外部依赖
import { ApiProperty } from '@nestjs/swagger';

/**请求日志搜索条件DTO */
export class ReqDto {
  /**用户ID */
  @ApiProperty({ description: '登陆名', example: 1 })
  userId: number;

  /**模块 */
  @ApiProperty({ description: '模块', example: 'auth' })
  module: string;

  /**控制器 */
  @ApiProperty({ description: '控制器', example: 'user' })
  controller: string;

  /**方法 */
  @ApiProperty({ description: '方法', example: 'create' })
  action: string;

  /**状态码 */
  @ApiProperty({ description: '状态码', example: 200 })
  status: number;

  /**开始时间 */
  @ApiProperty({ description: '开始时间', example: 100000000 })
  startAt: number;

  /**结束时间 */
  @ApiProperty({ description: '结束时间', example: 100000000 })
  endAt: number;
}
