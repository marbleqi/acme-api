// 外部依赖
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { AppModule } from '@src';
import { OperateEntity, OperateService } from '..';

describe('OperateService', () => {
  let service: OperateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([OperateEntity])],
      providers: [OperateService],
    }).compile();

    service = module.get<OperateService>(OperateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
