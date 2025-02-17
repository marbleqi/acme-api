// 外部依赖
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { AppModule } from '@src';
import { ReqEntity, ReqService } from '..';

describe('ReqService', () => {
  let service: ReqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([ReqEntity])],
      providers: [ReqService],
    }).compile();

    service = module.get<ReqService>(ReqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
