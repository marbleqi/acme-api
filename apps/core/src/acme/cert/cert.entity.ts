// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**证书配置 */
export class CertConfigEntity {
  /**账户ID */
  @ApiProperty({ description: '账户ID', example: 1 })
  @Column({
    type: 'int',
    name: 'account_id',
    default: 1,
    comment: '账户ID',
  })
  accountId: number;

  /**域名 */
  @ApiProperty({ description: '域名', example: 'example.com' })
  @Column({ type: 'text', name: 'domain', comment: '域名' })
  domain: string;

  /**域名解析服务商，关联到云服务商密钥表 */
  @ApiProperty({ description: '域名解析服务商', example: 1 })
  @Column({ type: 'int', name: 'dns', comment: '域名解析服务商' })
  dns: number;

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**证书表 */
@Entity('acme_certs')
export class CertEntity extends CommonEntity {
  /**证书ID */
  @ApiProperty({ description: '证书ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '证书ID' })
  id: number;

  /**证书配置信息 */
  @ApiProperty({ description: '证书配置信息' })
  @Column(() => CertConfigEntity, { prefix: false })
  config: CertConfigEntity;

  /**私钥 */
  @ApiProperty({ description: '私钥', example: '******' })
  @Column({ type: 'text', name: 'key', nullable: true, comment: '私钥' })
  key: string;

  /**证书 */
  @ApiProperty({ description: '证书', example: '******' })
  @Column({ type: 'text', name: 'cert', nullable: true, comment: '证书' })
  cert: string;

  /**证书生效时间 */
  @ApiProperty({ description: '证书生效时间', example: 1726243200000 })
  @Column({
    type: 'bigint',
    name: 'cert_start_time',
    default: 0,
    comment: '证书生效时间',
  })
  certStartTime: number;

  /**证书过期时间 */
  @ApiProperty({ description: '证书过期时间', example: 1734105599000 })
  @Column({
    type: 'bigint',
    name: 'cert_end_time',
    default: 0,
    comment: '证书过期时间',
  })
  certEndTime: number;

  /**证书状态 */
  @ApiProperty({ description: '证书状态', example: 'PAYED' })
  @Column({ type: 'text', name: 'cert_status', comment: '证书状态' })
  @Index()
  certStatus: string;
}

/**证书日志表 */
@Entity('acme_certs_logs')
export class CertLogEntity extends CommonLogEntity {
  /**证书ID */
  @ApiProperty({ description: '证书ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '证书ID' })
  @Index()
  id: number;

  /**证书配置信息 */
  @ApiProperty({ description: '证书配置信息' })
  @Column(() => CertConfigEntity, { prefix: false })
  config: CertConfigEntity;

  /**私钥 */
  @ApiProperty({ description: '私钥', example: '******' })
  @Column({ type: 'text', name: 'key', nullable: true, comment: '私钥' })
  key: string;

  /**证书 */
  @ApiProperty({ description: '证书', example: '******' })
  @Column({ type: 'text', name: 'cert', nullable: true, comment: '证书' })
  cert: string;

  /**证书生效时间 */
  @ApiProperty({ description: '证书生效时间', example: 1726243200000 })
  @Column({
    type: 'bigint',
    name: 'cert_start_time',
    default: 0,
    comment: '证书生效时间',
  })
  certStartTime: number;

  /**证书过期时间 */
  @ApiProperty({ description: '证书过期时间', example: 1734105599000 })
  @Column({
    type: 'bigint',
    name: 'cert_end_time',
    default: 0,
    comment: '证书过期时间',
  })
  certEndTime: number;

  /**证书状态 */
  @ApiProperty({ description: '证书状态', example: 'new' })
  @Column({
    type: 'text',
    name: 'cert_status',
    default: 'new',
    comment: '证书状态',
  })
  @Index()
  certStatus: 'new' | 'pending' | 'ready' | 'processing' | 'valid' | 'invalid';
}
