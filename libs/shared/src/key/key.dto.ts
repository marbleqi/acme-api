// 外部依赖
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

// DONE:已完成检查

/**密钥配置DTO */
export class KeyDto {
  /**密钥名称 */
  @ApiProperty({ description: '密钥名称', example: '阿里云生产密钥' })
  @IsDefined()
  @IsNotEmpty({ message: '密钥名称不能为空' })
  name: string;

  /**密钥说明 */
  @ApiProperty({ description: '密钥说明', example: '密钥说明' })
  @IsDefined()
  @IsNotEmpty({ message: '密钥说明不能为空' })
  description: string;

  /**云服务商 */
  @ApiProperty({ description: '云服务商', example: 'aliyun' })
  @IsDefined()
  @IsNotEmpty({ message: '云服务商不能为空' })
  provider: 'aws' | 'aliyun' | 'tencent';

  /**key */
  @ApiProperty({ description: 'key', example: 'key' })
  @IsDefined()
  @IsNotEmpty({ message: 'key不能为空' })
  key: string;

  /**KeySecret */
  @ApiProperty({ description: 'KeySecret', example: 'KeySecret' })
  @IsDefined()
  @IsNotEmpty({ message: 'KeySecret不能为空' })
  secret: string;

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
