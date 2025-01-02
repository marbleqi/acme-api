// 外部依赖
import { IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**账户信息DTO */
export class AccountDto {
  /**电子邮箱 */
  @ApiProperty({ description: '电子邮箱', example: 'admin@163.com' })
  @IsDefined()
  @IsNotEmpty({ message: '电子邮箱不能为空' })
  email: string;

  /**备注说明 */
  @ApiProperty({ description: '备注说明', example: '个人账号' })
  description?: string;

  /**使用测试环境 */
  @ApiProperty({ description: '使用测试环境', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '使用测试环境不能为空' })
  staging: boolean;

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
