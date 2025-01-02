// 外部依赖
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**用户信息DTO */
export class CertDto {
  /**账户ID */
  @ApiProperty({ description: '账户ID', example: 1 })
  @IsDefined()
  @IsNotEmpty({ message: '账户ID不能为空' })
  accountId: number;

  /**主域名 */
  @ApiProperty({ description: '主域名', example: 'example.com' })
  @IsDefined()
  @IsNotEmpty({ message: '主域名不能为空' })
  domain: string;

  /**备用域名 */
  @ApiProperty({ description: '备用域名', example: ['example.com'] })
  sans?: string[];

  /**域名解析服务商，关联到云服务商密钥表 */
  @ApiProperty({ description: '域名解析服务商', example: 1 })
  dns: number;

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}