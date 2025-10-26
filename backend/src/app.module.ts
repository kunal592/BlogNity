import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { InteractionModule } from './interaction.module';
import { ProfileModule } from './profile/profile.module';
import { MonetizationModule } from './monetization/monetization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    PrismaModule,
    CommentsModule,
    LikesModule,
    BookmarksModule,
    NotificationModule,
    AdminModule,
    AiModule,
    InteractionModule,
    ProfileModule,
    MonetizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
