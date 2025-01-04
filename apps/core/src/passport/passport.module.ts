// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { UserEntity, UserLogEntity, AuthModule } from '@auth';
import { PassportService, PassportController } from '.';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, UserLogEntity]),
  ],
  providers: [PassportService],
  controllers: [PassportController],
})
export class PassportModule {}
