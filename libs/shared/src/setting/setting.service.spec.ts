// 外部依赖
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

// 内部依赖
import { SharedModule } from '@shared';
import { AppModule } from '@src';
import { SettingEntity, SettingLogEntity, SettingService } from '..';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        AppModule,
        TypeOrmModule.forFeature([SettingEntity, SettingLogEntity]),
      ],
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
