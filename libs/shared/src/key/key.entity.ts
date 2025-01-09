// 外部依赖
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '..';

// DONE:已完成检查

/**密钥配置 */
export class KeyConfigEntity {
  /**密钥名称 */
  @ApiProperty({ description: '密钥名称', example: '阿里云生产密钥' })
  @Column({ type: 'text', name: 'name', default: '', comment: '密钥名称' })
  name: string;

  /**密钥说明 */
  @ApiProperty({ description: '密钥说明', example: '密钥说明' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '密钥说明',
  })
  description: string;

  /**云服务商 */
  @ApiProperty({ description: '云服务商', example: 'aliyun' })
  @Column({ type: 'text', name: 'provider', comment: '云服务商' })
  provider: 'aws' | 'aliyun' | 'tencent';

  /**key */
  @ApiProperty({ description: 'key', example: '*********' })
  @Column({ type: 'text', name: 'key', default: '', comment: 'key' })
  key: string;

  /**KeySecret */
  @ApiProperty({ description: 'KeySecret', example: '*********' })
  @Column({ type: 'text', name: 'secret', default: '', comment: 'KeySecret' })
  secret: string;

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**密钥表 */
@Entity('cloud_keys')
export class KeyEntity extends CommonEntity {
  /**密钥ID */
  @ApiProperty({ description: '密钥ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '密钥ID' })
  id: number;

  /**密钥配置信息 */
  @ApiProperty({ description: '密钥配置信息' })
  @Column(() => KeyConfigEntity, { prefix: false })
  config: KeyConfigEntity;
}

/**密钥日志表 */
@Entity('cloud_keys_logs')
export class KeyLogEntity extends CommonLogEntity {
  /**密钥ID */
  @ApiProperty({ description: '密钥ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '密钥ID' })
  @Index()
  id: number;

  /**密钥配置信息 */
  @ApiProperty({ description: '密钥配置信息' })
  @Column(() => KeyConfigEntity, { prefix: false })
  config: KeyConfigEntity;
}
