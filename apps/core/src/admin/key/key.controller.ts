// 外部依赖
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// 内部依赖
import { KeyDto, KeyEntity, KeyLogEntity, KeyService } from '@shared';
import { CommonController } from '@auth';

@Controller('key')
@ApiTags('系统管理-密钥')
export class KeyController extends CommonController<
  number,
  KeyDto,
  KeyDto,
  KeyEntity,
  KeyLogEntity
> {
  /**
   * 构造函数
   * @param keySrv 密钥服务
   */
  constructor(private readonly keySrv: KeyService) {
    super(keySrv, '访问控制', '用户', 100, 130);
  }
}
