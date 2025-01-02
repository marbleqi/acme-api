// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { AliyunModule } from '@aliyun';
import {
  AccountEntity,
  AccountLogEntity,
  CertEntity,
  CertLogEntity,
  AccountService,
  CertService,
  DeployService,
  AccountController,
  CertController,
  DeployController,
} from '.';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountLogEntity,
      CertEntity,
      CertLogEntity,
    ]),
    SharedModule,
    AliyunModule,
  ],
  providers: [AccountService, CertService, DeployService],
  controllers: [AccountController, CertController, DeployController],
})
export class AcmeModule {}
