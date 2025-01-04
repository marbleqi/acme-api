// 外部依赖
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { AuthModule } from '@auth';
import { AliyunModule } from '@aliyun';
import {
  AccountEntity,
  AccountLogEntity,
  CertEntity,
  CertLogEntity,
  AccountService,
  DnsService,
  CertService,
  DeployService,
  AccountController,
  CertController,
  DeployController,
} from '.';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    AuthModule,
    AliyunModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountLogEntity,
      CertEntity,
      CertLogEntity,
    ]),
  ],
  providers: [AccountService, DnsService, CertService, DeployService],
  controllers: [AccountController, CertController, DeployController],
})
export class AcmeModule {}
