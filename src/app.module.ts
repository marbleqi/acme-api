// 外部依赖
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule, ReqInterceptor } from '@shared';
import {
  AccountEntity,
  AccountLogEntity,
  AccountService,
  AccountController,
} from '.';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // 进行配置参数验证
        if (!process.env.POSTGRES_HOST) {
          throw new Error('未配置数据库地址');
        }
        const host = process.env.POSTGRES_HOST;
        const port = process.env.POSTGRES_PORT
          ? parseInt(process.env.POSTGRES_PORT, 10)
          : 5432;
        if (!process.env.POSTGRES_DB) {
          throw new Error('未配置数据库名');
        }
        const database = process.env.POSTGRES_DB;
        if (!process.env.POSTGRES_USER) {
          throw new Error('未配置数据库用户');
        }
        const username = process.env.POSTGRES_USER;
        if (!process.env.POSTGRES_PSW) {
          throw new Error('未配置数据库密码');
        }
        const password = process.env.POSTGRES_PSW;
        console.debug('当前环境', process.env.NODE_ENV);
        /**同步配置，当开发环境和演示环境时，自动同步表结构 */
        const synchronize = process.env.NODE_ENV
          ? ['dev', 'demo'].includes(process.env.NODE_ENV)
          : false;
        return {
          type: 'postgres',
          host,
          port,
          database,
          username,
          password,
          synchronize,
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([AccountEntity, AccountLogEntity]),
    SharedModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ReqInterceptor },
    AccountService,
  ],
  controllers: [AccountController],
})
export class AppModule {}
