import { Test, TestingModule } from '@nestjs/testing';
import { OperateService } from './operate.service';

describe('OperateService', () => {
  let service: OperateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperateService],
    }).compile();

    service = module.get<OperateService>(OperateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
