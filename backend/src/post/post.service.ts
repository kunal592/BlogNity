import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

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
    return this.prisma.post.findMany({ include: { author: true }});
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
    return this.prisma.post.findUnique({ where: { id }, include: { author: true } });
  }

  findByAuthor(authorId: string) {
    return this.prisma.post.findMany({ where: { authorId }, include: { author: true } });
  }

  search(query: string) {
    return this.prisma.post.findMany({ 
        where: { 
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
            ]
        },
        include: { author: true }
    });
  }

  async summarize(id: string): Promise<{ summary: string }> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error('Post not found');
    }
    const summary = await this.aiService.summarize(post.content);
    return { summary };
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
