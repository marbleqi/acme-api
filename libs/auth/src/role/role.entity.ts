// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**角色配置 */
export class RoleConfigEntity {
  /**角色名称 */
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @Column({ type: 'text', name: 'name', default: '', comment: '角色名称' })
  name: string;

  /**角色说明 */
  @ApiProperty({ description: '角色说明', example: '拥有所有权限' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '角色说明',
  })
  description: string;

  /**角色授权权限点 */
  @ApiProperty({ description: '角色授权权限点', example: [1] })
  @Column({
    type: 'int',
    name: 'abilities',
    default: [],
    array: true,
    comment: '角色授权权限点',
  })
  abilities: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**角色表 */
@Entity('auth_roles')
export class RoleEntity extends CommonEntity {
  /**角色ID */
  @ApiProperty({ description: '角色ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '角色ID' })
  id: number;

  /**角色配置 */
  @ApiProperty({ description: '角色配置' })
  @Column(() => RoleConfigEntity, { prefix: false })
  config: RoleConfigEntity;
}

/**角色日志表 */
@Entity('auth_roles_logs')
export class RoleLogEntity extends CommonLogEntity {
  /**角色ID */
  @ApiProperty({ description: '角色ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '角色ID' })
  @Index()
  id: number;

  /**角色配置 */
  @ApiProperty({ description: '角色配置' })
  @Column(() => RoleConfigEntity, { prefix: false })
  config: RoleConfigEntity;
}
