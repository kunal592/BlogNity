import { Test, TestingModule } from '@nestjs/testing';
import { SocialSystemService } from './social-system.service';

describe('SocialSystemService', () => {
  let service: SocialSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialSystemService],
    }).compile();

    service = module.get<SocialSystemService>(SocialSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
