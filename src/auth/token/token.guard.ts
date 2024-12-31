// 外部依赖
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AddressInfo } from 'net';
import { Request, Response } from 'express';
// 内部依赖
import {
  CreateEntity,
  UpdateEntity,
  ReqEntity,
  OperateService,
  ReqService,
} from '@shared';
import { UserService, TokenService } from '..';

/**全局路由守卫
 *
 * 统一完成token令牌访问控制和权限点访问控制
 */
@Injectable()
export class TokenGuard implements CanActivate {
  /**
   * 构造函数
   * @param reflector 反射器
   * @param commonSrv 通用服务
   * @param operateSrv 操作序号服务
   * @param reqSrv 请求日志服务
   * @param tokenSrv 令牌服务
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly reqSrv: ReqService,
    private readonly operateSrv: OperateService,
    private readonly userSrv: UserService,
    private readonly tokenSrv: TokenService,
  ) {}

  /**
   * 路由守卫函数
   * @param context 执行上下文
   * @returns 守卫通过标记
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**请求时间 */
    const at = Date.now();
    /**请求上下文 */
    const req: Request = context.switchToHttp().getRequest();
    /**响应上下文 */
    const res: Response = context.switchToHttp().getResponse();
    /**请求客户端IP */
    const clientIp = req.ip;
    /**响应服务端信息 */
    const addressInfo = req.socket.address() as AddressInfo;
    /**响应服务端IP */
    const serverIp = addressInfo.address;
    // 请求消息可能存在敏感信息，先写入响应上下文中，以便在需要的控制器中脱敏，最后再在拦截器之后保存到请求日志中
    const request = {
      headers: req.headers,
      url: req.url,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
    };
    res.locals.request = request;
    /**路径路由 */
    const route = req.url.split('/');
    /**模块名 */
    let module = '/';
    /**对象名 */
    let controller = '/';
    if (route.length >= 2) {
      if (route[0]) {
        module = route[0];
        controller = route[1];
      } else {
        module = route[1];
        controller = route[2];
      }
    }
    /**调用的控制器的方法名 */
    const action = context.getHandler().name;
    /**组装请求日志参数 */
    const params: ReqEntity = {
      startAt: at,
      clientIp,
      serverIp,
      module,
      controller,
      action,
      userId: 0,
    } as ReqEntity;
    // 如果请求url是passport开头则无需验证
    if (['passport'].includes(module)) {
      // 添加请求日志
      res.locals.reqId = await this.reqSrv.insert(params);
      // 将请求ID设置到响应头
      res.setHeader('request_id', res.locals.reqId);
      // 返回通过
      return true;
    }
    /**消息头中的令牌 */
    const tokenKey = req.headers.token as string;
    /**缓存中的令牌 */
    const token = await this.tokenSrv.show(tokenKey);
    /**用户ID */
    const userId = Number(token.id) || 0;
    // 如果用户ID无效，则令牌验证无效
    if (!userId) {
      /**请求结果 */
      const result = '用户令牌验证无效';
      /**请求日志ID */
      res.locals.reqId = await this.reqSrv.insert({
        ...params,
        endAt: Date.now(),
        status: HttpStatus.UNAUTHORIZED,
        result,
        request,
        userId,
      } as ReqEntity);
      // 将请求ID设置到响应头
      res.setHeader('request_id', res.locals.reqId);
      // 抛出异常。注：路由守卫抛出异常后，将不会再调用拦截器，请求也不会再转发到控制器
      throw new UnauthorizedException(result);
    }
    /**当前路由需要权限点 */
    const abilities =
      this.reflector.get<number[]>('abilities', context.getHandler()) || [];
    console.debug('abilities', abilities);
    // 如果验证无效
    // if (this.userSrv.invalid(userId, abilities)) {
    //   // 更新用户的最后会话时间，注：异步
    //   this.userSrv.session(userId);
    //   // 令牌验证不通过
    //   const result = '用户未授权使用该接口';
    //   // 添加请求日志
    //   res.locals.reqId = await this.reqSrv.insert({
    //     ...params,
    //     endAt: Date.now(),
    //     status: HttpStatus.FORBIDDEN,
    //     result,
    //     request,
    //     userId,
    //   } as ReqEntity);
    //   // 将请求ID设置到响应头
    //   res.setHeader('request_id', res.locals.reqId);
    //   // 抛出异常。注：路由守卫抛出异常后，将不会再调用拦截器，请求也不会再转发到控制器
    //   throw new ForbiddenException(result);
    // }
    // 其余情况为验证通过
    // 更新用户的最后会话时间，注：异步
    // this.userSrv.session(userId);
    res.locals.userId = userId;
    // 添加请求日志
    res.locals.reqId = await this.reqSrv.insert({
      ...params,
      userId,
    } as ReqEntity);
    // 将请求ID设置到响应头
    res.setHeader('request_id', res.locals.reqId);
    /**操作对象 */
    const name = this.reflector.get<string>('name', context.getHandler()) || '';
    /**操作类型 */
    const operate =
      this.reflector.get<string>('operate', context.getHandler()) || '';
    if (operate) {
      const operateId = await this.operateSrv.create(name, operate);
      res.locals.update = {
        userId,
        at,
        operateId,
        operate,
        reqId: res.locals.reqId,
      } as UpdateEntity;
      if (operate === 'create') {
        res.locals.create = { userId, at } as CreateEntity;
      }
    }
    return true;
  }
}
