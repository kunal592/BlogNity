import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async getProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        posts: { where: { publishedAt: { not: null } } },
        _count: {
          select: { receivedFollows: true, sentFollows: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { receivedFollows, sentFollows } = user._count;

    return {
      ...user,
      followersCount: receivedFollows,
      followingCount: sentFollows,
    };
  }

  async updateProfile(userId: string, bio: string, avatar: Express.Multer.File) {
    let avatarUrl: string;

    if (avatar) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        uploadStream.end(avatar.buffer);
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        ...(avatarUrl && { profileImage: avatarUrl }),
      },
    });

    return updatedUser;
  }
}
