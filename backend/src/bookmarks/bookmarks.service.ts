import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  create(createBookmarkDto: CreateBookmarkDto) {
    const { userId, postId } = createBookmarkDto;
    return this.prisma.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
  }

  findAll() {
    return this.prisma.bookmark.findMany();
  }

  findOne(id: string) {
    return this.prisma.bookmark.findUnique({ where: { id } });
  }

  update(id: string, updateBookmarkDto: UpdateBookmarkDto) {
    const { userId, postId } = updateBookmarkDto;
    let data: any = {};
    if (userId) {
      data.user = { connect: { id: userId } };
    }
    if (postId) {
      data.post = { connect: { id: postId } };
    }

    return this.prisma.bookmark.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.bookmark.delete({ where: { id } });
  }
}
