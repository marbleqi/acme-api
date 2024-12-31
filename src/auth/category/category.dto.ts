// 外部依赖
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**产品类别信息DTO */
export class CategoryDto {
  /**产品类别名称 */
  @ApiProperty({ description: '产品类别名称', example: '主产品' })
  @IsDefined()
  @IsNotEmpty({ message: '产品类别名称不能为空' })
  name: string;

  /**产品类别说明 */
  @ApiProperty({ description: '产品类别说明', example: '主产品分类' })
  @IsDefined()
  @IsNotEmpty({ message: '产品类别说明不能为空' })
  description: string;

  /**归类的产品数组 */
  @ApiProperty({ description: '归类的产品数组', example: ['auth'] })
  @IsDefined()
  @IsNotEmpty({ message: '归类的产品数组不能为空' })
  @IsArray({ message: '归类的产品数组必须为字符串数组' })
  products: string[];

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}