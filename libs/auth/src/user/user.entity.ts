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

/**用户配置 */
export abstract class UserConfigEntity {
  /**登陆名 */
  @ApiProperty({ description: '登陆名', example: 'admin' })
  @Column({ type: 'text', name: 'login_name', comment: '登陆名' })
  loginName: string;

  /**姓名 */
  @ApiProperty({ description: '姓名', example: '孙悟空' })
  @Column({ type: 'text', name: 'name', default: '', comment: '姓名' })
  name: string;

  /**头像URL */
  @ApiProperty({
    description: '头像URL',
    example: 'http://www.baidu.com/1.jpg',
  })
  @Column({ type: 'text', name: 'avatar', default: '', comment: '头像URL' })
  avatar: string;

  /**电子邮箱 */
  @ApiProperty({ description: '电子邮箱', example: 'admin@admin.com' })
  @Column({ type: 'text', name: 'email', default: '', comment: '电子邮箱' })
  email: string;

  /**用户授权角色 */
  @ApiProperty({ description: '用户授权角色', example: [1] })
  @Column({
    type: 'int',
    name: 'roles',
    default: [],
    array: true,
    comment: '用户授权角色',
  })
  roles: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**用户密码 */
  @ApiProperty({ description: '用户密码', example: '****************' })
  @Column({ type: 'text', name: 'password', default: '', comment: '用户密码' })
  password: string;

  /**锁定状态，true表示锁定，false表示未锁定 */
  @ApiProperty({ description: '锁定状态', example: false })
  @Column({ type: 'bool', name: 'locked', default: false, comment: '锁定状态' })
  locked: boolean;
}

/**用户表，增加登陆名字段为唯一性索引 */
@Entity('auth_users')
export class UserEntity extends CommonEntity {
  /**用户ID */
  @ApiProperty({ description: '用户ID', example: 5 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '用户ID' })
  id: number;

  /**用户配置 */
  @ApiProperty({ description: '用户配置' })
  @Column(() => UserConfigEntity, { prefix: false })
  @Index(['loginName'], { unique: true })
  config: UserConfigEntity;

  /**密码错误次数 */
  @ApiProperty({ description: '密码错误次数', example: 5 })
  @Column({
    type: 'int',
    name: 'psw_times',
    default: 0,
    comment: '密码错误次数',
  })
  pswTimes: number;

  /**登陆次数 */
  @ApiProperty({ description: '登陆次数', example: 1 })
  @Column({ type: 'int', name: 'login_times', default: 0, comment: '登陆次数' })
  loginTimes: number;

  /**首次登录时间 */
  @ApiProperty({ description: '首次登录时间', example: 100000000 })
  @Column({
    type: 'bigint',
    name: 'first_login_at',
    default: 0,
    comment: '首次登录时间',
  })
  firstLoginAt: number;

  /**最后登录IP */
  @ApiProperty({ description: '最后登录IP', example: '127.0.0.1' })
  @Column({
    type: 'inet',
    name: 'last_login_ip',
    default: '127.0.0.1',
    comment: '最后登录IP',
  })
  lastLoginIp: string;

  /**最后登录时间 */
  @ApiProperty({ description: '最后登录时间', example: 100000000 })
  @Column({
    type: 'bigint',
    name: 'last_login_at',
    default: 0,
    comment: '最后登录时间',
  })
  lastLoginAt: number;

  /**最后会话时间 */
  @ApiProperty({ description: '最后会话时间', example: 100000000 })
  @Column({
    type: 'bigint',
    name: 'last_session_at',
    default: 0,
    comment: '最后会话时间',
  })
  lastSessionAt: number;

  /**对长整型数据返回时，进行数据转换 */
  @AfterLoad()
  userLoad() {
    this.firstLoginAt = this.firstLoginAt ? Number(this.firstLoginAt) : 0;
    this.lastLoginAt = this.lastLoginAt ? Number(this.lastLoginAt) : 0;
    this.lastSessionAt = this.lastSessionAt ? Number(this.lastSessionAt) : 0;
  }
}

/**用户日志表 */
@Entity('auth_users_logs')
export class UserLogEntity extends CommonLogEntity {
  /**用户ID */
  @ApiProperty({ description: '用户ID', example: 5 })
  @Column({ type: 'int', name: 'id', comment: '用户ID' })
  @Index()
  id: number;

  /**用户配置 */
  @ApiProperty({ description: '用户配置' })
  @Column(() => UserConfigEntity, { prefix: false })
  config: UserConfigEntity;
}
