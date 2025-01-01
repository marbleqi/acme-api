// 外部依赖
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**用户信息DTO */
export class UserDto {
  /**登陆名 */
  @ApiProperty({ description: '登陆名', example: 'loginName' })
  @IsDefined()
  @IsNotEmpty({ message: '登陆名不能为空' })
  loginName: string;

  /**姓名 */
  @ApiProperty({ description: '姓名', example: '孙悟空' })
  @IsDefined()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  /**头像URL */
  @ApiProperty({
    description: '头像URL',
    example: 'http://www.baidu.com/1.jpg',
  })
  avatar?: string;

  /**电子邮箱 */
  @ApiProperty({ description: '电子邮箱', example: 'admin@admin.com' })
  email?: string;

  /**用户授权角色 */
  @ApiProperty({ description: '用户授权角色', example: [1] })
  @IsDefined()
  @IsNotEmpty({ message: '用户授权角色不能为空' })
  @IsArray({ message: '用户的授权角色必须为数字数组' })
  roles: number[];

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
