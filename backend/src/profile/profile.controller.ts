import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { Multer } from 'multer';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.profileService.getProfile(username);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Request() req,
    @Body() body: { bio?: string },
    @UploadedFile() avatar: Multer.File,
  ) {
    const { id: userId } = req.user;
    return this.profileService.updateProfile(userId, body.bio, avatar);
  }
}
