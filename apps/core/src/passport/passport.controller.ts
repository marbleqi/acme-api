// 外部依赖
import {
  Controller,
  Get,
  Post,
  Headers,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// 内部依赖
import { TokenService, BaseController } from '@auth';
import { LoginDto, PassportService } from '.';

@Controller('passport')
@ApiTags('身份认证')
export class PassportController extends BaseController {
  /**
   * 构造函数
   * @param passportSrv 身份认证服务
   */
  constructor(
    private readonly tokenSrv: TokenService,
    private readonly passportSrv: PassportService,
  ) {
    super();
  }
  /**
   * 密码登录
   * @param loginName 登陆名
   * @param loginPsw 密码
   * @param loginIp 客户端IP
   * @param res 响应上下文
   */
  @Post('login')
  @ApiOperation({ summary: '密码登录' })
  @ApiHeader({
    name: 'x-real-ip',
    description: '客户端IP',
    required: true,
    example: '127.0.0.1',
  })
  @ApiBody({ description: '新用户信息', type: LoginDto })
  private async login(
    @Headers('x-real-ip') loginIp: string,
    @Body() config: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // 将上下文的密码替换，避免将密码明文记入日志
    res.locals.request.body.loginPsw = '************';
    console.debug('headers', req.headers);
    console.debug('loginIpA', loginIp);
    loginIp = loginIp ?? '127.0.0.1';
    console.debug('loginIpB', loginIp);
    // 验证用户身份
    const user = await this.passportSrv.login(config, loginIp);
    console.debug('userB', config, user, user.id, loginIp);
    res.locals.result = await this.tokenSrv.create(user.id);
  }
}
