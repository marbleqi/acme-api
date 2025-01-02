import { Module } from '@nestjs/common';
import { ZoneService, DnsService } from '.';

@Module({
  providers: [ZoneService, DnsService],
  exports: [ZoneService, DnsService],
})
export class Route53Module {}
