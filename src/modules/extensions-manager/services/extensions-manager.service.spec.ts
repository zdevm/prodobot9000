import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsManagerService } from './extensions-manager.service';

describe('ExtensionsManagerService', () => {
  let service: ExtensionsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtensionsManagerService],
    }).compile();

    service = module.get<ExtensionsManagerService>(ExtensionsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
