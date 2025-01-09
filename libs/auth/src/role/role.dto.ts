// 外部依赖
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DONE:已完成检查

/**角色信息DTO */
export class RoleDto {
  /**角色名称 */
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @IsDefined()
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  /**角色说明 */
  @ApiProperty({ description: '角色说明', example: '拥有所有权限' })
  @IsDefined()
  @IsNotEmpty({ message: '角色说明不能为空' })
  description: string;

  /**角色授权权限点 */
  @ApiProperty({ description: '角色授权权限点', example: [1] })
  @IsDefined()
  @IsNotEmpty({ message: '角色授权权限点不能为空' })
  @IsArray({ message: '角色授权权限点必须为数字数组' })
  abilities: number[];

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
