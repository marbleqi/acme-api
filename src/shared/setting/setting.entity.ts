// 外部依赖
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// 内部依赖
import { CommonEntity, CommonLogEntity } from '..';

/**配置表 */
@Entity('sys_settings')
export class SettingEntity extends CommonEntity {
  /**配置编码 */
  @ApiProperty({ description: '配置编码', example: 'system' })
  @PrimaryColumn({ type: 'text', name: 'code', comment: '配置编码' })
  code: string;

  /**配置值 */
  @ApiProperty({ description: '值', example: { app: '运维平台' } })
  @Column({ type: 'json', name: 'config', comment: '值' })
  config: any;
}

/**配置日志表 */
@Entity('sys_settings_logs')
export class SettingLogEntity extends CommonLogEntity {
  /**配置编码 */
  @ApiProperty({ description: '配置编码', example: 'system' })
  @Column({ type: 'text', name: 'code', comment: '配置编码' })
  code: string;

  /**配置值 */
  @ApiProperty({ description: '值', example: { app: '运维平台' } })
  @Column({ type: 'json', name: 'config', comment: '值' })
  config: any;
}
