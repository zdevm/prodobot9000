import { Test, TestingModule } from '@nestjs/testing';
import { RateProviderService } from './rate-provider.service';

describe('RateProviderService', () => {
  let service: RateProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateProviderService],
    }).compile();

    service = module.get<RateProviderService>(RateProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
