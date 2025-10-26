import { Module } from '@nestjs/common';
import { SocialSystemController } from './social-system.controller';
import { SocialSystemService } from './social-system.service';

@Module({
  controllers: [SocialSystemController],
  providers: [SocialSystemService]
})
export class SocialSystemModule {}
