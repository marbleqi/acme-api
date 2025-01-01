// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**用户组配置 */
export class GroupConfigEntity {
  /**用户组名称 */
  @ApiProperty({ description: '用户组名称', example: '管理员' })
  @Column({ type: 'text', name: 'name', default: '', comment: '用户组名称' })
  name: string;

  /**用户组说明 */
  @ApiProperty({ description: '用户组说明', example: '管理员分组' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '用户组说明',
  })
  description: string;

  /**归属的用户数组 */
  @ApiProperty({ description: '用户数组', example: [1] })
  @Column({
    type: 'int',
    name: 'users',
    default: [],
    array: true,
    comment: '归属的用户数组',
  })
  users: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**用户组表 */
@Entity('auth_groups')
export class GroupEntity extends CommonEntity {
  /**用户组ID */
  @ApiProperty({ description: '用户组ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '用户组ID' })
  id: number;

  /**用户组配置 */
  @ApiProperty({ description: '用户组配置' })
  @Column(() => GroupConfigEntity, { prefix: false })
  config: GroupConfigEntity;
}

/**用户组日志表 */
@Entity('auth_groups_logs')
export class GroupLogEntity extends CommonLogEntity {
  /**用户组ID */
  @ApiProperty({ description: '用户组ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '用户组ID' })
  @Index()
  id: number;

  /**用户组配置 */
  @ApiProperty({ description: '用户组配置' })
  @Column(() => GroupConfigEntity, { prefix: false })
  config: GroupConfigEntity;
}
