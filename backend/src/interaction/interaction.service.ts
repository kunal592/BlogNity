import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  create(createInteractionDto: CreateInteractionDto) {
    const { userId, postId, ...interactionData } = createInteractionDto;
    return this.prisma.like.create({ 
      data: {
        ...interactionData,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } }
      }
     });
  }

  findAll() {
    return this.prisma.like.findMany();
  }

  findOne(id: string) {
    return this.prisma.like.findUnique({ where: { id } });
  }

  update(id: string, updateInteractionDto: UpdateInteractionDto) {
    const { userId, postId, ...interactionData } = updateInteractionDto;
    let data: any = { ...interactionData };
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
