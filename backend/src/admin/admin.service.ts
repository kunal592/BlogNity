import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany();
  }

  listPosts() {
    return this.prisma.post.findMany();
  }

  listReportedComments() {
    return this.prisma.comment.findMany({ where: { reported: true } });
  }

  resolveReportedComment(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { reported: false },
    });
  }

  async manageContent(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (post) {
      return this.prisma.post.delete({ where: { id } });
    }
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (comment) {
      return this.prisma.comment.delete({ where: { id } });
    }
  }
}
