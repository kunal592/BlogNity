
# Real-time Data Endpoints Analysis

This document provides a detailed analysis of the necessary real-time data endpoints for the project, based on the existing codebase and feature descriptions. These endpoints are crucial for building a dynamic and interactive user experience.

## Implementation Strategy: Server-Sent Events (SSE)

For an efficient and straightforward real-time data flow from server to client, we will use Server-Sent Events (SSE). This approach is simpler to implement than WebSockets and is ideal for scenarios where the client primarily receives updates from the server.

### Backend Implementation (Node.js/Express Example)

The backend will be responsible for creating and managing the SSE endpoints. When a relevant event occurs (e.g., a new comment is posted), the server will push that data to the connected clients.

```javascript
const express = require('express');
const app = express();

// In-memory store for connected clients
const clients = {};

app.get('/api/posts/:postId/comments/stream', (req, res) => {
  const { postId } = req.params;

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Store the client's response object
  if (!clients[postId]) {
    clients[postId] = [];
  }
  clients[postId].push(res);

  // Clean up when the client disconnects
  req.on('close', () => {
    clients[postId] = clients[postId].filter(client => client !== res);
  });
});

// Function to send updates to clients
function sendCommentUpdate(postId, comment) {
  if (clients[postId]) {
    const eventData = `data: ${JSON.stringify(comment)}\n\n`;
    clients[postId].forEach(client => client.write(eventData));
  }
}

// Example: When a new comment is created, call sendCommentUpdate
// This would be triggered in your route that handles new comment submissions.
```

### Frontend Implementation (React Example)

The frontend will use the built-in `EventSource` API to connect to the SSE endpoints. It will listen for incoming messages and update the component's state accordingly.

```javascript
import { useEffect, useState } from 'react';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/posts/${postId}/comments/stream`);

    eventSource.onmessage = (event) => {
      const newComment = JSON.parse(event.data);
      setComments(prevComments => [...prevComments, newComment]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    // Clean up the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [postId]);

  // ... render comments
}
```

## 1. Blog Post Interactions

### Likes
- **Endpoint:** `POST /api/posts/{postId}/like`
- **Action:** Allows a logged-in user to like a post.
- **Endpoint:** `DELETE /api/posts/{postId}/like`
- **Action:** Allows a logged-in user to unlike a post.
- **SSE Connection:** `GET /api/posts/{postId}/likes/stream` to receive real-time updates on the like count.

### Comments
- **Endpoint:** `POST /api/posts/{postId}/comments`
- **Action:** Allows a logged-in user to add a comment to a post.
- **SSE Connection:** `GET /api/posts/{postId}/comments/stream` to receive new comments in real-time.

### Bookmarks
- **Endpoint:** `POST /api/users/{userId}/bookmarks`
- **Action:** Allows a logged-in user to bookmark a post.
- **Endpoint:** `DELETE /api/users/{userId}/bookmarks/{postId}`
- **Action:** Allows a logged-in user to remove a bookmark from a post.

### AI Summarization
- **Endpoint:** `POST /api/posts/{postId}/summarize`
- **Action:** Initiates an AI-powered summarization of the blog post.
- **SSE Connection:** A user-specific SSE connection to receive a notification when the summarization is complete.

## 2. User Interactions

### Follow
- **Endpoint:** `POST /api/users/{authorId}/follow`
- **Action:** Allows a logged-in user to follow an author.
- **Endpoint:** `DELETE /api/users/{authorId}/unfollow`
- **Action:** Allows a logged-in user to unfollow an author.

### Profile Updates (Avatar, Bio, etc.)
- **Endpoint:** `PUT /api/users/{userId}/profile`
- **Action:** Allows a user to update their profile information.
- **SSE Connection:** `GET /api/users/{userId}/profile/stream` to broadcast profile updates in real-time.

## 3. Personalized Feed
- **SSE Connection:** `GET /api/users/{userId}/feed/stream` - Pushes updates to the user's feed when a followed author publishes a new post.

## 4. Admin Panel

- **SSE Connections:**
  - **New Users:** `GET /api/admin/users/stream` - Pushes updates when new users sign up.
  - **New Posts:** `GET /api/admin/posts/stream` - Pushes updates when new posts are created.
  - **Platform Metrics:** `GET /api/admin/metrics/stream` - Streams real-time analytics data.

## 5. Notifications

- **SSE Connection:** `GET /api/users/{userId}/notifications/stream`
  - **Action:** A dedicated SSE connection for sending real-time notifications to users about new followers, likes, and comments.

## 6. Database Schema

This schema is designed to support all the features described above, including user authentication, blog posts, social interactions, and notifications.

### `users`
- `id` (UUID, Primary Key)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `avatar_url` (VARCHAR)
- `bio` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `posts`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `title` (VARCHAR)
- `content` (TEXT)
- `slug` (VARCHAR, UNIQUE) - for user-friendly URLs
- `cover_image_url` (VARCHAR)
- `published` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `comments`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `post_id` (UUID, Foreign Key to `posts.id`)
- `content` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `likes`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `post_id` (UUID, Foreign Key to `posts.id`)
- `created_at` (TIMESTAMP)
- *Composite UNIQUE constraint on (`user_id`, `post_id`)*

### `bookmarks`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `post_id` (UUID, Foreign Key to `posts.id`)
- `created_at` (TIMESTAMP)
- *Composite UNIQUE constraint on (`user_id`, `post_id`)*

### `followers`
- `follower_id` (UUID, Foreign Key to `users.id`) - The user who is following
- `following_id` (UUID, Foreign Key to `users.id`) - The user who is being followed
- `created_at` (TIMESTAMP)
- *Primary Key on (`follower_id`, `following_id`)*

### `notifications`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`) - The recipient of the notification
- `type` (ENUM: 'new_follower', 'like', 'comment')
- `actor_id` (UUID, Foreign Key to `users.id`) - The user who triggered the notification
- `post_id` (UUID, Foreign Key to `posts.id`, nullable) - The post associated with the notification
- `read` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP)








```

### `my old schema`
// schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Make sure the pgcrypto/uuid-ossp extension is available on your DB if needed.
}

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
  PAYMENT
}

enum LikeTarget {
  POST
  COMMENT
}

model User {
  id              String      @id @default(uuid())
  role            Role        @default(USER)
  email           String      @unique
  emailVerified   DateTime?   
  username        String?     @unique
  name            String?
  bio             String?     
  profileImage    String?     
  socialLinks     Json?       // { twitter: "...", github: "...", linkedin: "..." }
  providerAccount Account[]   // NextAuth relation (Account model)
  sessions        Session[]   // NextAuth sessions
  posts           Post[]      @relation("authorPosts")
  comments        Comment[]   @relation("authorComments")
  likes           Like[]      
  bookmarks       Bookmark[]  
  followsGiven    Follow[]    @relation("follower")
  followsReceived Follow[]    @relation("following")
  notifications   Notification[] @relation("notificationsReceived")
  payments        Payment[]   
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([username])
  @@index([email])
}

model Post {
  id             String       @id @default(uuid())
  author         User?        @relation("authorPosts", fields: [authorId], references: [id], onDelete: SetNull)
  authorId       String?
  title          String
  slug           String       @unique
  thumbnailUrl   String?
  excerpt        String?
  content        String       // store markdown content
  renderedHtml   String?      // optional pre-rendered HTML (if you want)
  status         PostStatus   @default(DRAFT)
  visibility     PostVisibility @default(PUBLIC)
  isFeatured     Boolean      @default(false)
  readingTime    Int?         // minutes estimate
  tags           PostTag[]
  postTags       PostTag[]    // relation field for explicit join table
  likes          Like[]       
  comments       Comment[]    
  bookmarks      Bookmark[]   
  shares         Share[]
  viewsCount     Int          @default(0)
  likesCount     Int          @default(0)
  commentsCount  Int          @default(0)
  bookmarksCount Int          @default(0)
  sharesCount    Int          @default(0)
  publishedAt    DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([slug])
  @@index([publishedAt])
  @@index([authorId])
}

model Tag {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  description String?
  posts       PostTag[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([name])
}

model PostTag {
  id      String @id @default(uuid())
  post    Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId  String
  tag     Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId   String
  createdAt DateTime @default(now())

  @@unique([postId, tagId])
  @@index([tagId])
  @@index([postId])
}

model Comment {
  id           String     @id @default(uuid())
  post         Post       @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId       String
  author       User?      @relation("authorComments", fields: [authorId], references: [id], onDelete: SetNull)
  authorId     String?
  parent       Comment?   @relation("commentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  parentId     String?
  replies      Comment[]  @relation("commentReplies")
  content      String     // markdown content
  renderedHtml String?    // optional pre-rendered HTML
  isEdited     Boolean    @default(false)
  isDeleted    Boolean    @default(false)
  likes        Like[]     
  likesCount   Int        @default(0)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([postId])
  @@index([authorId])
}

model Like {
  id        String     @id @default(uuid())
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  target    LikeTarget
  post      Post?      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String?
  comment   Comment?   @relation(fields: [commentId], references: [id], onDelete: Cascade)
  commentId String?
  createdAt DateTime   @default(now())

  // ensure a user can't like the same target twice
  @@unique([userId, postId], name: "unique_user_post_like", map: "unique_user_post_like") // will ignore if postId null
  @@unique([userId, commentId], name: "unique_user_comment_like", map: "unique_user_comment_like") // will ignore if commentId null

  @@index([userId])
  @@index([postId])
  @@index([commentId])
}

model Bookmark {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  createdAt DateTime @default(now())

  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
}

model Share {
  id         String  @id @default(uuid())
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String
  post       Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId     String
  platform   String? // e.g., "twitter", "facebook", "whatsapp", "internal"
  metadata   Json?   // { url, text, extra }
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([postId])
}

model Follow {
  id           String   @id @default(uuid())
  follower     User     @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followerId   String
  following    User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  followingId  String
  createdAt    DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model Notification {
  id           String          @id @default(uuid())
  recipient    User            @relation("notificationsReceived", fields: [recipientId], references: [id], onDelete: Cascade)
  recipientId  String
  actor        User?           @relation(fields: [actorId], references: [id], onDelete: SetNull)
  actorId      String?
  type         NotificationType
  entityType   EntityType?
  entityId     String?         // e.g., postId, commentId, userId, paymentId
  data         Json?           // arbitrary payload (used by client to render)
  isRead       Boolean         @default(false)
  createdAt    DateTime        @default(now())

  @@index([recipientId, isRead])
  @@index([actorId])
  @@index([type])
}

model Payment {
  id                String   @id @default(uuid())
  user              User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId            String?
  razorpayOrderId   String?  @unique
  razorpayPaymentId String?  @unique
  status            String   // e.g., created, paid, failed, refunded
  amount            Int      // in smallest currency unit (paise)
  currency          String   @default("INR")
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

//////////////////////////////////////////
// NextAuth compatibility models (recommended)
//////////////////////////////////////////

model Account {
  id                 String  @id @default(cuid())
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? 
  access_token       String? 
  expires_at         Int? 
  token_type         String? 
  scope              String? 
  id_token           String? 
  session_state      String? 

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String
  expires      DateTime

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```