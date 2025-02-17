// 外部依赖
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

// 内部依赖
import { RedisService } from '..';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
