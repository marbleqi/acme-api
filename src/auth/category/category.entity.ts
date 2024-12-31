// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**产品类别配置 */
export class CategoryConfigEntity {
  /**产品类别名称 */
  @ApiProperty({ description: '产品类别名称', example: '主产品' })
  @Column({ type: 'text', name: 'name', default: '', comment: '产品类别名称' })
  name: string;

  /**产品类别说明 */
  @ApiProperty({ description: '产品类别说明', example: '主产品分类' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '产品类别说明',
  })
  description: string;

  /**归类的产品数组 */
  @ApiProperty({ description: '归类的产品数组', example: ['auth'] })
  @Column({
    type: 'int',
    name: 'menus',
    default: [],
    array: true,
    comment: '归类的产品数组',
  })
  products: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**产品类别表 */
@Entity('auth_categories')
export class CategoryEntity extends CommonEntity {
  /**产品类别ID */
  @ApiProperty({ description: '产品类别ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '产品类别ID' })
  id: number;

  /**产品类别配置 */
  @ApiProperty({ description: '产品类别配置' })
  @Column(() => CategoryConfigEntity, { prefix: false })
  config: CategoryConfigEntity;
}

/**产品类别日志表 */
@Entity('auth_categories_logs')
export class CategoryLogEntity extends CommonLogEntity {
  /**产品类别ID */
  @ApiProperty({ description: '产品类别ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '产品类别ID' })
  @Index()
  id: number;

  /**产品类别配置 */
  @ApiProperty({ description: '产品类别配置' })
  @Column(() => CategoryConfigEntity, { prefix: false })
  config: CategoryConfigEntity;
}
