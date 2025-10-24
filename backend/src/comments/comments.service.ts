import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(createCommentDto: CreateCommentDto) {
    const { authorId, postId, ...commentData } = createCommentDto;
    return this.prisma.comment.create({ 
      data: {
        ...commentData,
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } }
      }
     });
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  findOne(id: string) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    const { authorId, postId, ...commentData } = updateCommentDto;
    let data: any = { ...commentData };
    if (authorId) {
      data.author = { connect: { id: authorId } };
    }
    if (postId) {
        data.post = { connect: { id: postId } };
    }

    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
