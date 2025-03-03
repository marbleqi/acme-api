// 外部依赖
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**操作序号管道 */
@Injectable()
export class OperatePipe implements PipeTransform {
  /**
   * 将操作序号转换成数字
   * @param value 原数据
   * @param metadata
   * @returns 转换后数据
   */
  transform(value: any, metadata: ArgumentMetadata): number {
    console.debug('metadata', metadata);
    return Number(value) || -1;
  }
}
