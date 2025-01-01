/**权限点 */
import { ApiProperty } from '@nestjs/swagger';

/**令牌 */
export class Token {
  /**用户ID */
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  /**令牌 */
  @ApiProperty({ description: '令牌', example: 'abcdefghijklmn' })
  token: string;

  /**令牌过期时间 */
  @ApiProperty({ description: '令牌过期时间', example: 60000 })
  expired?: number;
}
