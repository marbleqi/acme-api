// 外部依赖
import { IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DONE:已完成检查

/**密码登录信息DTO */
export class LoginDto {
  /**登陆名 */
  @ApiProperty({ description: '登陆名', example: 'loginName' })
  @IsDefined()
  @IsNotEmpty({ message: '登陆名不能为空' })
  loginName: string;

  /**密码 */
  @ApiProperty({ description: '密码', example: '********' })
  @IsDefined()
  @IsNotEmpty({ message: '密码不能为空' })
  loginPsw: string;
}
