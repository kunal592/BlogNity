import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    const { authorId, title, ...postData } = createPostDto;
    return this.prisma.post.create({ data: { 
      title,
      slug: slugify(title, { lower: true, strict: true }),
      ...postData,
      author: { connect: { id: String(authorId) } }
     } });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async getFeed(userId: string) {
    const followedUsers = await this.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });

    const followedUserIds = followedUsers.map((follow) => follow.followingId);

    return this.prisma.post.findMany({
        where: {
            authorId: {
                in: followedUserIds,
            },
        },
        include: {
            author: true,
        },
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const { authorId, title, ...postData } = updatePostDto;
    let data: any = { ...postData };
    if (authorId) {
      data.author = { connect: { id: String(authorId) } };
    }
    if (title) {
      data.title = title;
      data.slug = slugify(title, { lower: true, strict: true });
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
