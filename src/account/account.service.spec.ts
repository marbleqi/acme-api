// 外部依赖
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { AccountEntity, AccountLogEntity, AccountService, AppModule } from '..';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        SharedModule,
        TypeOrmModule.forFeature([AccountEntity, AccountLogEntity]),
      ],
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
