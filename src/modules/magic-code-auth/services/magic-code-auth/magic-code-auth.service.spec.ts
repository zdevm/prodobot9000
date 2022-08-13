import { Test, TestingModule } from '@nestjs/testing';
import { MagicCodeAuthService } from './magic-code-auth.service';

describe('MagicCodeAuthService', () => {
  let service: MagicCodeAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagicCodeAuthService],
    }).compile();

    service = module.get<MagicCodeAuthService>(MagicCodeAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
