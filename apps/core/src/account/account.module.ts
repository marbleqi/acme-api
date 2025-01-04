// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { UserEntity, UserLogEntity, AuthModule } from '@auth';
import { AccountService, AccountGateway, AccountController } from '.';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, UserLogEntity]),
  ],
  providers: [AccountService, AccountGateway],
  controllers: [AccountController],
})
export class AccountModule {}
