import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { Route53Module } from './route53/route53.module';

@Module({
  providers: [AwsService],
  exports: [AwsService],
  imports: [Route53Module],
})
export class AwsModule {}
