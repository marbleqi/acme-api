// 外部依赖
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// 内部依赖
import { SharedModule } from '@shared';
import { ApiService, CasService, AliyunService } from '.';

@Module({
  imports: [HttpModule, SharedModule],
  providers: [ApiService, CasService, AliyunService],
  exports: [CasService, AliyunService],
})
export class AliyunModule {}
