// 外部依赖
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**用户组信息DTO */
export class GroupDto {
  /**用户组名称 */
  @ApiProperty({ description: '用户组名称', example: '管理员' })
  @IsDefined()
  @IsNotEmpty({ message: '用户组名称不能为空' })
  name: string;

  /**用户组说明 */
  @ApiProperty({ description: '用户组说明', example: '管理员分组' })
  @IsDefined()
  @IsNotEmpty({ message: '用户组说明不能为空' })
  description: string;

  /**用户数组 */
  @ApiProperty({ description: '用户数组', example: [1] })
  @IsDefined()
  @IsNotEmpty({ message: '用户数组不能为空' })
  @IsArray({ message: '用户数组必须为数字数组' })
  users: number[];

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
