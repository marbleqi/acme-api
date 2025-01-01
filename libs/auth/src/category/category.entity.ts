// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**模块类别配置 */
export class CategoryConfigEntity {
  /**模块类别名称 */
  @ApiProperty({ description: '模块类别名称', example: '主模块' })
  @Column({ type: 'text', name: 'name', default: '', comment: '模块类别名称' })
  name: string;

  /**模块类别说明 */
  @ApiProperty({ description: '模块类别说明', example: '主模块分类' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '模块类别说明',
  })
  description: string;

  /**归类的模块数组 */
  @ApiProperty({ description: '归类的模块数组', example: ['auth'] })
  @Column({
    type: 'text',
    name: 'modules',
    default: [],
    array: true,
    comment: '归类的模块数组',
  })
  modules: string[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**模块类别表 */
@Entity('auth_categories')
export class CategoryEntity extends CommonEntity {
  /**模块类别ID */
  @ApiProperty({ description: '模块类别ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '模块类别ID' })
  id: number;

  /**模块类别配置 */
  @ApiProperty({ description: '模块类别配置' })
  @Column(() => CategoryConfigEntity, { prefix: false })
  config: CategoryConfigEntity;
}

/**模块类别日志表 */
@Entity('auth_categories_logs')
export class CategoryLogEntity extends CommonLogEntity {
  /**模块类别ID */
  @ApiProperty({ description: '模块类别ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '模块类别ID' })
  @Index()
  id: number;

  /**模块类别配置 */
  @ApiProperty({ description: '模块类别配置' })
  @Column(() => CategoryConfigEntity, { prefix: false })
  config: CategoryConfigEntity;
}
