import { Test, TestingModule } from '@nestjs/testing';
import { SocialSystemController } from './social-system.controller';

describe('SocialSystemController', () => {
  let controller: SocialSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialSystemController],
    }).compile();

    controller = module.get<SocialSystemController>(SocialSystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
