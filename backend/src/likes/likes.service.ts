import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LikeTarget } from '@prisma/client';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  create(createLikeDto: CreateLikeDto) {
    const { userId, postId, commentId, ...likeData } = createLikeDto;
    const target = postId ? LikeTarget.POST : LikeTarget.COMMENT;
    return this.prisma.like.create({ 
      data: {
        ...likeData,
        target,
        user: { connect: { id: userId } },
        post: postId ? { connect: { id: postId } } : undefined,
        comment: commentId ? { connect: { id: commentId } } : undefined,
      }
     });
  }

  findAll() {
    return this.prisma.like.findMany();
  }

  findOne(id: string) {
    return this.prisma.like.findUnique({ where: { id } });
  }

  update(id: string, updateLikeDto: UpdateLikeDto) {
    const { userId, postId, ...likeData } = updateLikeDto;
    let data: any = { ...likeData };
    if (userId) {
      data.user = { connect: { id: userId } };
    }
    if (postId) {
        data.post = { connect: { id: postId } };
    }

    return this.prisma.like.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.like.delete({ where: { id } });
  }
}
