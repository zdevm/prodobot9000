import { Test, TestingModule } from '@nestjs/testing';
import { MagicCodeAuthController } from './magic-code-auth.controller';

describe('MagicCodeAuthController', () => {
  let controller: MagicCodeAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MagicCodeAuthController],
    }).compile();

    controller = module.get<MagicCodeAuthController>(MagicCodeAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
