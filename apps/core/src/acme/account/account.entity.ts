// 外部依赖
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  AfterLoad,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 内部依赖
import { CommonEntity, CommonLogEntity } from '@shared';

/**账户配置 */
export class AccountConfigEntity {
  /**电子邮箱 */
  @ApiProperty({ description: '电子邮箱', example: 'admin@163.com' })
  @Column({ type: 'text', name: 'email', default: '', comment: '电子邮箱' })
  email: string;

  /**备注说明 */
  @ApiProperty({ description: '备注说明', example: '个人账号' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '备注说明',
  })
  description: string;

  /**使用测试环境，true表示使用测试环境，false表示使用生产环境 */
  @ApiProperty({ description: '使用测试环境', example: true })
  @Column({
    type: 'bool',
    name: 'staging',
    default: true,
    comment: '使用测试环境',
  })
  staging: boolean;

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;
}

/**账户表 */
@Entity('acme_accounts')
export class AccountEntity extends CommonEntity {
  /**账户ID */
  @ApiProperty({ description: '账户ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '账户ID' })
  id: number;

  /**账号配置信息 */
  @ApiProperty({ description: '账号配置信息' })
  @Column(() => AccountConfigEntity, { prefix: false })
  config: AccountConfigEntity;

  /**账户私钥 */
  @ApiProperty({ description: '账户私钥', example: 'key' })
  @Column({ type: 'bytea', name: 'account_key', comment: '账户私钥' })
  accountKey: Buffer;

  /**最新证书申请时间 */
  @ApiProperty({ description: '最新证书申请时间', example: 100000000 })
  @Column({
    type: 'bigint',
    name: 'last_request_at',
    default: 0,
    comment: '最新证书申请时间',
  })
  lastRequestAt: number;

  /**对长整型数据返回时，进行数据转换 */
  @AfterLoad()
  userLoad() {
    this.lastRequestAt = this.lastRequestAt ? Number(this.lastRequestAt) : 0;
  }
}

/**账户日志表 */
@Entity('acme_accounts_logs')
export class AccountLogEntity extends CommonLogEntity {
  /**账户ID */
  @ApiProperty({ description: '账户ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '账户ID' })
  @Index()
  id: number;

  /**账号配置信息 */
  @ApiProperty({ description: '账号配置信息' })
  @Column(() => AccountConfigEntity, { prefix: false })
  config: AccountConfigEntity;

  /**账户私钥 */
  @ApiProperty({ description: '账户私钥', example: [] })
  @Column({ type: 'bytea', name: 'account_key', comment: '账户私钥' })
  accountKey: Buffer;
}
