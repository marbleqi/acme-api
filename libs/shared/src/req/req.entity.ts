// 外部依赖
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  AfterLoad,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**请求日志表 */
@Entity('sys_req_logs')
export class ReqEntity {
  /**请求ID */
  @ApiProperty({ description: '请求ID', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'req_id', comment: '请求ID' })
  reqId: number;

  /**请求用户ID */
  @ApiProperty({ description: '请求用户ID', example: 1 })
  @Column({ type: 'int', name: 'user_id', default: 0, comment: '请求用户ID' })
  @Index()
  userId: number;

  /**模块 */
  @ApiProperty({ description: '模块', example: 'auth' })
  @Column({ type: 'text', name: 'module', comment: '模块' })
  module: string;

  /**控制器 */
  @ApiProperty({ description: '控制器', example: 'user' })
  @Column({ type: 'text', name: 'controller', comment: '控制器' })
  controller: string;

  /**方法 */
  @ApiProperty({ description: '方法', example: 'create' })
  @Column({ type: 'text', name: 'action', comment: '方法' })
  action: string;

  /**请求信息 */
  @ApiProperty({ description: '请求信息', example: { user: 'root' } })
  @Column({
    type: 'json',
    name: 'request',
    nullable: true,
    comment: '请求信息',
  })
  request: any;

  /**状态码 */
  @ApiProperty({ description: '状态码', example: 200 })
  @Column({ type: 'int', name: 'status', default: 200, comment: '状态码' })
  status: number;

  /**响应结果 */
  @ApiProperty({ description: '响应结果', example: { user: 'root' } })
  @Column({ type: 'json', name: 'result', nullable: true, comment: '响应结果' })
  result: any;

  /**客户端IP */
  @ApiProperty({ description: '客户端IP', example: '127.0.0.1' })
  @Column({ type: 'inet', name: 'client_ip', comment: '客户端IP' })
  clientIp: string;

  /**服务器IP */
  @ApiProperty({ description: '服务器IP', example: '127.0.0.1' })
  @Column({ type: 'inet', name: 'server_ip', comment: '服务器IP' })
  serverIp: string;

  /**请求到达时间 */
  @ApiProperty({ description: '请求到达时间', example: 100000000000 })
  @Column({
    type: 'bigint',
    name: 'start_at',
    default: 0,
    comment: '请求到达时间',
  })
  @Index()
  startAt: number;

  /**响应完成时间 */
  @ApiProperty({ description: '响应完成时间', example: 100000000000 })
  @Column({
    type: 'bigint',
    name: 'end_at',
    default: 0,
    comment: '响应完成时间',
  })
  @Index()
  endAt: number;

  /**对长整型数据进行数据转换 */
  @AfterLoad()
  reqLoad() {
    console.debug('触发日志load操作');
    this.reqId = this.reqId ? Number(this.reqId) : 0;
    this.startAt = this.startAt ? Number(this.startAt) : 0;
    this.endAt = this.endAt ? Number(this.endAt) : 0;
  }
}
