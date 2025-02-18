import { Test, TestingModule } from '@nestjs/testing';
import { CertController } from './cert.controller';

describe('CertController', () => {
  let controller: CertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertController],
    }).compile();

    controller = module.get<CertController>(CertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
