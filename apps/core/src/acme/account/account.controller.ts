// 外部依赖
import { Controller } from '@nestjs/common';

// 内部依赖
import { CommonController } from '@auth';
import {
  AccountDto,
  AccountEntity,
  AccountLogEntity,
  AccountService,
} from '..';

@Controller('acme/account')
export class AccountController extends CommonController<
  number,
  AccountDto,
  AccountDto,
  AccountEntity,
  AccountLogEntity
> {
  /**
   * 构造函数
   * @param accountSrv 用户服务
   */
  constructor(private readonly accountSrv: AccountService) {
    super(accountSrv, 'ACME', '账户', 100, 130);
  }
}
