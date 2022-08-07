import { Test, TestingModule } from '@nestjs/testing';
import { ProductRateController } from './product-rate.controller';

describe('ProductRateController', () => {
  let controller: ProductRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductRateController],
    }).compile();

    controller = module.get<ProductRateController>(ProductRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
