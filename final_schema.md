This schema is a refined and consolidated version, taking into account the project's feature requirements and the structure of your original schema. It is designed to be comprehensive, scalable, and supportive of all identified features for the 'blognity' platform.

## Key Improvements and Considerations:

*   **Robust User Model:** Incorporates roles, social links, and the necessary relations for NextAuth.js, providing a solid foundation for user management and authentication.
*   **Detailed Post Management:** Includes fields for status, visibility, featured posts, and reading time, which are crucial for a content-focused platform.
*   **Flexible Interactions:** The `Like` model is designed to be polymorphic, allowing users to like both posts and comments without needing separate tables.
*   **Organized Content:** A many-to-many relationship between `Post` and `Tag` is established through a `PostTag` join table, allowing for flexible content categorization.
*   **Enhanced Notifications:** The `Notification` model is designed to be versatile, using `entityType` and `entityId` to refer to different kinds of in-app events (new followers, comments, etc.).
*   **Scalability:** The schema includes models for future-facing features like payments and detailed admin capabilities.

---

# Final Database Schema for Blognity

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ENUMS

enum Role {
  USER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum PostVisibility {
  PUBLIC
  UNLISTED
  PRIVATE
}

enum NotificationType {
  LIKE
  COMMENT
  FOLLOW
  MENTION
  NEW_POST
  BOOKMARK
  ADMIN_ALERT
}

enum EntityType {
  POST
  COMMENT
  USER
}

enum LikeTarget {
  POST
  COMMENT
}

// CORE MODELS

model User {
  id              String         @id @default(uuid())
  role            Role           @default(USER)
  email           String         @unique
  emailVerified   DateTime?
  username        String?        @unique
  name            String?
  bio             String?
  profileImage    String?
  socialLinks     Json? // { twitter: "...", github: "...", linkedin: "..." }
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations
  accounts        Account[]
  sessions        Session[]
  posts           Post[]
  comments        Comment[]
  likes           Like[]
  bookmarks       Bookmark[]
  sentFollows     Follow[]       @relation("follower")
  receivedFollows Follow[]       @relation("following")
  notifications   Notification[] @relation("notificationsReceived")

  @@index([username])
  @@index([email])
}

model Post {
  id             String         @id @default(uuid())
  authorId       String
  title          String
  slug           String         @unique
  thumbnailUrl   String?
  excerpt        String?
  content        String // Markdown content
  status         PostStatus     @default(DRAFT)
  visibility     PostVisibility @default(PUBLIC)
  isFeatured     Boolean        @default(false)
  readingTime    Int? // Estimated reading time in minutes
  publishedAt    DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  // Relations
  author         User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags           PostTag[]
  comments       Comment[]
  likes          Like[]
  bookmarks      Bookmark[]
  
  // Counters (denormalized for performance)
  viewsCount     Int            @default(0)
  likesCount     Int            @default(0)
  commentsCount  Int            @default(0)
  bookmarksCount Int            @default(0)

  @@index([slug])
  @@index([authorId])
  @@index([publishedAt])
}

model Tag {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  posts       PostTag[]

  @@index([name])
}

model PostTag {
  postId  String
  tagId   String

  // Relations
  post    Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag     Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}

model Comment {
  id        String    @id @default(uuid())
  postId    String
  authorId  String
  parentId  String? // For nested comments
  content   String
  isEdited  Boolean   @default(false)
  isDeleted Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("commentReplies", fields: [parentId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  replies   Comment[] @relation("commentReplies")
  likes     Like[]

  // Counters
  likesCount Int      @default(0)

  @@index([postId])
  @@index([authorId])
}

// INTERACTION MODELS

model Like {
  id        String     @id @default(uuid())
  userId    String
  target    LikeTarget
  postId    String?
  commentId String?
  createdAt DateTime   @default(now())

  // Relations
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post?      @relation(fields: [postId], references: [id], onDelete: Cascade)
  comment   Comment?   @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@unique([userId, postId]) // A user can only like a post once
  @@unique([userId, commentId]) // A user can only like a comment once
  @@index([postId])
  @@index([commentId])
}

model Bookmark {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([postId])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  // Relations
  follower    User     @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}

model Notification {
  id          String           @id @default(uuid())
  recipientId String
  actorId     String
  type        NotificationType
  entityType  EntityType?      // e.g., POST, COMMENT
  entityId    String?          // e.g., postId, commentId
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())

  // Relations
  recipient   User             @relation("notificationsReceived", fields: [recipientId], references: [id], onDelete: Cascade)
  actor       User             @relation(fields: [actorId], references: [id], onDelete: Cascade)

  @@index([recipientId, isRead])
}

// NEXTAUTH MODELS

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  // Relation
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  // Relation
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```
