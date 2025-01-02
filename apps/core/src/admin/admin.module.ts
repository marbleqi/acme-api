import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { AuthModule } from '@auth';
import { KeyController } from '.';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [KeyController],
})
export class AdminModule {}
