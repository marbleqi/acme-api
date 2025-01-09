// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import {
  RoleEntity,
  RoleLogEntity,
  UserEntity,
  UserLogEntity,
  AbilityService,
  RoleService,
  UserService,
  TokenService,
  DashboardService,
  AuthService,
  AbilityController,
  RoleController,
  UserController,
  TokenController,
  DashboardController,
} from '.';

// DONE:已完成检查

/**访问控制模块 */
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      RoleLogEntity,
      UserEntity,
      UserLogEntity,
    ]),
  ],
  providers: [
    AbilityService,
    RoleService,
    UserService,
    TokenService,
    DashboardService,
    AuthService,
  ],
  controllers: [
    AbilityController,
    RoleController,
    UserController,
    TokenController,
    DashboardController,
  ],
  exports: [AbilityService, RoleService, UserService, TokenService],
})
export class AuthModule {}
