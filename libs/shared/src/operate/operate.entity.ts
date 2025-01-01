// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**操作序号表 */
@Entity('sys_operates')
export class OperateEntity {
  /**操作序号 */
  @ApiProperty({ description: '操作序号', example: 100 })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: '操作序号' })
  id: number;

  /**操作对象 */
  @ApiProperty({ description: '操作对象', example: 'auth/user' })
  @Column({ type: 'text', name: 'name', comment: '操作对象' })
  name: string;

  /**操作类型 */
  @ApiProperty({ description: '操作类型', example: 'create' })
  @Column({ type: 'text', name: 'operate', comment: '操作类型' })
  operate: string;

  /**操作时间 */
  @ApiProperty({ description: '操作时间', example: 100000000000 })
  @Column({ type: 'bigint', name: 'at', comment: '操作时间' })
  at: number;

  /**对长整型数据进行数据转换 */
  @AfterLoad()
  operateLoad() {
    this.id = this.id ? Number(this.id) : 0;
    this.at = this.at ? Number(this.at) : 0;
  }
}
