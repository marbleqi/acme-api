// 外部依赖
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// 内部依赖
import {
  CategoryDto,
  Abilities,
  CategoryEntity,
  CategoryLogEntity,
  CategoryService,
  CommonController,
} from '..';

/**产品类别控制器 */
@Controller('auth/category')
@ApiTags('访问控制-菜单类别')
@Abilities(120)
export class CategoryController extends CommonController<
  number,
  CategoryDto,
  CategoryDto,
  CategoryEntity,
  CategoryLogEntity
> {
  /**
   * 构造函数
   * @param categorySrv 产品类别服务
   */
  constructor(private readonly categorySrv: CategoryService) {
    super(categorySrv, '访问控制', '产品类别', 100, 120);
  }
}
