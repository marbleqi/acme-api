// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { CommonService } from '@shared';
import { CategoryDto, CategoryEntity, CategoryLogEntity } from '..';

/**产品类别服务 */
@Injectable()
export class CategoryService extends CommonService<
  number,
  CategoryDto,
  CategoryDto,
  CategoryEntity,
  CategoryLogEntity
> {
  /**
   * 构造函数
   * @param categoryRepository 产品类别存储器
   * @param categoryLogRepository 产品类别日志存储器
   */
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryLogEntity)
    private readonly categoryLogRepository: Repository<CategoryLogEntity>,
  ) {
    super(
      'id',
      'category',
      '产品类别',
      categoryRepository,
      categoryLogRepository,
    );
  }
}
