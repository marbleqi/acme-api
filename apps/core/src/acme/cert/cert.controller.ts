// 外部依赖
import { Controller } from '@nestjs/common';

// 内部依赖
import { CommonController } from '@auth';
import { CertDto, CertEntity, CertLogEntity, CertService } from '..';

@Controller('acme/cert')
export class CertController extends CommonController<
  number,
  CertDto,
  CertDto,
  CertEntity,
  CertLogEntity
> {
  /**
   * 构造函数
   * @param certSrv 用户服务
   */
  constructor(private readonly certSrv: CertService) {
    super(certSrv, 'ACME', '证书', 100, 130);
  }
}
