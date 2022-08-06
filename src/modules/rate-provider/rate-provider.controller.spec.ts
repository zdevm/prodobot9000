import { Test, TestingModule } from '@nestjs/testing';
import { RateProviderController } from './rate-provider.controller';

describe('RateProviderController', () => {
  let controller: RateProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateProviderController],
    }).compile();

    controller = module.get<RateProviderController>(RateProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
