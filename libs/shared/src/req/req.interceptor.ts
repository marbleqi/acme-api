// 外部依赖
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { map, tap, catchError } from 'rxjs';

// 内部依赖
import { ReqEntity, ReqService } from '..';

/**全局拦截器
 *
 * 给响应报文加上请求标记，并发出响应，发送记录日志任务
 */
@Injectable()
export class ReqInterceptor implements NestInterceptor {
  /**
   * 构造函数
   * @param reqSrv 请求日志服务
   */
  constructor(private readonly reqSrv: ReqService) {}

  /**
   * 拦截器函数
   * @param context 处理上下文
   * @param next 函数处理后
   * @returns 响应报文可观察者
   */
  intercept(context: ExecutionContext, next: CallHandler) {
    /**
     * 更新请求日志的用户ID，请求内容和响应内容
     * 1、异步处理，避免影响响应效率
     * 2、用户ID在登陆验证等请求时，无法在路由守卫阶段获得，只能在业务处理逻辑中获得，所以需要在此处再次更新
     * 3、请求内容可能存在敏感数据，需要在业务处理逻辑中脱敏，所以需要在此处更新
     * 4、响应内容只能在业务处理逻辑完成后得到，所以在此处更新
     */
    /**响应上下文 */
    const res: Response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      // 请求异常时的处理
      catchError((err: HttpException) => {
        // 记录异常日志
        void this.reqSrv.update(
          res.locals.reqId as number,
          {
            userId: Number(res.locals.userId),
            request: Number(res.locals.request),
            result: err.getResponse(),
            status: err.getStatus(),
            endAt: Date.now(),
          } as ReqEntity,
        );
        // 抛出异常
        throw err;
      }),
      // 请求正常时的处理
      tap(() => {
        // 记录正常日志
        void this.reqSrv.update(
          res.locals.reqId as number,
          {
            userId: Number(res.locals.userId),
            request: Object(res.locals.request),
            result: Object(res.locals.result),
            status: res.statusCode,
            endAt: Date.now(),
          } as ReqEntity,
        );
      }),
      // 设置响应结果
      map(() => {
        res.json(res.locals.result);
      }),
    );
  }
}
