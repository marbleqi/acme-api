// 外部依赖
import { Column, PrimaryGeneratedColumn, Index, AfterLoad } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**通用创建嵌入实体 */
export class CreateEntity {
  /**创建用户ID */
  @ApiProperty({ description: '创建用户ID', example: 1 })
  @Column({
    type: 'int',
    name: '_user_id',
    comment: '创建用户ID',
    update: false,
  })
  userId: number;

  /**创建时间 */
  @ApiProperty({ description: '创建时间', example: 100000000000 })
  @Column({
    type: 'bigint',
    name: '_at',
    default: 0,
    comment: '创建时间',
    update: false,
  })
  at: number;

  /**对长整型数据进行数据转换 */
  @AfterLoad()
  createLoad() {
    this.at = this.at ? Number(this.at) : 0;
  }
}

/**通用更新嵌入实体 */
export class UpdateEntity {
  /**更新用户ID */
  @ApiProperty({ description: '更新用户ID', example: 1 })
  @Column({ type: 'int', name: '_user_id', comment: '更新用户ID' })
  userId: number;

  /**更新时间 */
  @ApiProperty({ description: '更新时间', example: 100000000000 })
  @Column({ type: 'bigint', name: '_at', default: 0, comment: '更新时间' })
  at: number;

  /**操作序号 */
  @ApiProperty({ description: '操作序号', example: 100 })
  @Column({
    type: 'bigint',
    name: '_operate_id',
    default: 0,
    comment: '操作序号',
  })
  @Index()
  operateId: number;

  /**操作类型 */
  @ApiProperty({ description: '操作类型', example: 'create' })
  @Column({ type: 'text', name: '_operate', comment: '操作类型' })
  operate: string;

  /**请求序号 */
  @ApiProperty({ description: '请求序号', example: 0 })
  @Column({ type: 'bigint', name: '_req_id', default: 0, comment: '请求序号' })
  reqId: number;

  /**对长整型数据进行数据转换 */
  @AfterLoad()
  updateLoad() {
    this.at = this.at ? Number(this.at) : 0;
    this.operateId = this.operateId ? Number(this.operateId) : 0;
    this.reqId = this.reqId ? Number(this.reqId) : 0;
  }
}

/**通用日志嵌入实体 */
export class LogEntity {
  /**日志ID */
  @ApiProperty({ description: '日志序号', example: 5 })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: '_id',
    comment: '日志序号',
  })
  id: number;

  /**对长整型数据进行数据转换 */
  @AfterLoad()
  logLoad() {
    this.id = this.id ? Number(this.id) : 0;
  }
}

/**通用对象基类实体 */
export abstract class CommonEntity {
  /**创建信息 */
  @ApiProperty({ description: '创建信息' })
  @Column(() => CreateEntity)
  create: CreateEntity;

  /**更新信息 */
  @ApiProperty({ description: '更新信息' })
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**通用对象日志基类实体 */
export abstract class CommonLogEntity {
  /**日志信息 */
  @ApiProperty({ description: '日志信息' })
  @Column(() => LogEntity)
  log: LogEntity;

  /**更新信息 */
  @ApiProperty({ description: '更新信息' })
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}
