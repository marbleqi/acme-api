// 外部依赖
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '..';

// DONE:已完成检查

/**排序数据表 */
@Entity('sys_sorts')
export class SortEntity extends CommonEntity {
  /**排序对象 */
  @ApiProperty({ description: '排序对象', example: 'system' })
  @PrimaryColumn({ type: 'text', name: 'entity', comment: '排序对象' })
  entity: string;

  /**排序数据 */
  @ApiProperty({ description: '排序数据', example: [1, 2] })
  @Column({ type: 'json', name: 'config', comment: '排序数据' })
  config: number[] | string[];
}

/**排序日志表 */
@Entity('sys_sorts_logs')
export class SortLogEntity extends CommonLogEntity {
  /**排序对象 */
  @ApiProperty({ description: '排序对象', example: 'system' })
  @Column({ type: 'text', name: 'entity', comment: '排序对象' })
  @Index()
  entity: string;

  /**排序数据 */
  @ApiProperty({ description: '排序数据', example: [1, 2] })
  @Column({ type: 'json', name: 'config', comment: '排序数据' })
  config: number[] | string[];
}
