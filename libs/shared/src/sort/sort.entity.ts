// 外部依赖
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// 内部依赖
import { CommonEntity, CommonLogEntity } from '..';

/**排序数据表 */
@Entity('sys_sorts')
export class SortEntity extends CommonEntity {
  /**配置编码 */
  @ApiProperty({ description: '配置编码', example: 'system' })
  @PrimaryColumn({ type: 'text', name: 'code', comment: '配置编码' })
  code: string;

  /**排序数据 */
  @ApiProperty({ description: '排序数据', example: [1, 2] })
  @Column({ type: 'int', name: 'value', comment: '排序数据', array: true })
  config: number[];
}

/**排序日志表 */
@Entity('sys_sorts_logs')
export class SortLogEntity extends CommonLogEntity {
  /**配置编码 */
  @ApiProperty({ description: '配置编码', example: 'system' })
  @Column({ type: 'text', name: 'code', comment: '配置编码' })
  code: string;

  /**排序数据 */
  @ApiProperty({ description: '排序数据', example: [1, 2] })
  @Column({ type: 'int', name: 'value', comment: '排序数据', array: true })
  config: number[];
}
