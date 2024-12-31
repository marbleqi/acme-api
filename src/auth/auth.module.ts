// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 内部依赖
import { SharedModule } from '@shared';
import {
  CategoryEntity,
  CategoryLogEntity,
  RoleEntity,
  RoleLogEntity,
  UserEntity,
  UserLogEntity,
  GroupEntity,
  GroupLogEntity,
  AbilityService,
  CategoryService,
  RoleService,
  UserService,
  GroupService,
  TokenService,
  DashboardService,
  AuthService,
  AbilityController,
  CategoryController,
  RoleController,
  UserController,
  GroupController,
  TokenController,
  DashboardController,
} from '.';

/**访问控制模块 */
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      RoleLogEntity,
      UserEntity,
      UserLogEntity,
      CategoryEntity,
      CategoryLogEntity,
      GroupEntity,
      GroupLogEntity,
    ]),
  ],
  providers: [
    AbilityService,
    RoleService,
    UserService,
    CategoryService,
    GroupService,
    TokenService,
    DashboardService,
    AuthService,
  ],
  controllers: [
    AbilityController,
    CategoryController,
    RoleController,
    UserController,
    GroupController,
    TokenController,
    DashboardController,
  ],
  exports: [
    AbilityService,
    RoleService,
    UserService,
    CategoryService,
    GroupService,
    TokenService,
  ],
})
export class AuthModule {}
