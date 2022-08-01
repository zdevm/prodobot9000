import { Test, TestingModule } from '@nestjs/testing';
import { ProductRateService } from './product-rate.service';

describe('ProductRateService', () => {
  let service: ProductRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRateService],
    }).compile();

    service = module.get<ProductRateService>(ProductRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
