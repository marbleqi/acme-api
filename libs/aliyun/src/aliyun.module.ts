// 外部依赖
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// 内部依赖
import { SharedModule } from '@shared';
import { ApiService, CasService, DnsService, AliyunService } from '.';

@Module({
  imports: [HttpModule, SharedModule],
  providers: [ApiService, CasService, DnsService, AliyunService],
  exports: [CasService, DnsService],
})
export class AliyunModule {}
