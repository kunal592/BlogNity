# Project Architecture Overview

This document outlines the proposed system architecture for this application, leveraging the strengths of Google Cloud and Firebase to create a scalable, secure, and feature-rich platform.

## 1. Frontend

*   **Framework:** Next.js (as indicated by the existing project structure)
*   **Hosting:** NO Hosting Needed

**Rationale:** No deploying.

## 2. Backend

*   **Framework:** Nest.js (as indicated by the `backend` directory)
*   **Hosting:** no
**Rationale:** 

## 3. Database

*   **Service:** Cloud Firestore

**Rationale:** Firestore is a flexible, scalable NoSQL document database. Its data model (collections of documents) is well-suited for the kind of data your application will handle (users, blog posts, comments, etc.). Key features include:
    *   **Real-time Updates:** This is perfect for features like your personalized feed and live comment updates.
    *   **Scalability:** Firestore scales automatically to meet demand.
    *   **Offline Support:** It offers offline data access for mobile and web clients.

A potential `schema.prisma` file in `backend/prisma` could look like this:
```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String?
  avatarUrl   String?
  bio         String?
  posts       Post[]
  comments    Comment[]
  likes       Like[]
  followedBy  Follow[]  @relation("Following")
  following   Follow[]  @relation("Follower")
  bookmarks   Bookmark[]
}

model Post {
  id          String    @id @default(cuid())
  title       String
  content     String
  excerpt     String?
  thumbnailUrl String?
  published   Boolean   @default(false)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  tags        String[]
  views       Int       @default(0)
  isExclusive Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  comments    Comment[]
  likes       Like[]
  bookmarks   Bookmark[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}

model Like {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}

model Follow {
  id          String   @id @default(cuid())
  follower    User     @relation("Follower", fields: [followerId], references: [id])
  followerId  String
  following   User     @relation("Following", fields: [followingId], references: [id])
  followingId String
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
}

model Bookmark {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}
```

## 4. Authentication

*   **Service:** Firebase Authentication

**Rationale:** Firebase Authentication provides a complete identity solution, supporting email/password, social logins (Google, Facebook, etc.), and more. It integrates seamlessly with Firestore and Firebase Functions, allowing you to secure your data and backend services easily.

## 5. File Storage

*   **Service:** Cloud Storage for Firebase

**Rationale:** For user-generated content like profile avatars and post thumbnails, Cloud Storage is the ideal solution. It's a powerful, simple, and cost-effective object storage service.

## 6. AI-Powered Features

*   **Service:** Genkit with a Generative AI Model

**Rationale:** For the "AI SEO Optimize" feature, you can use Genkit, which is already present in your project. This can be run in a serverless environment like Cloud Functions to interact with a powerful generative AI model. This will allow you to offer sophisticated AI-powered assistance to your users.

## Summary

By adopting this architecture, you will have a robust, scalable, and secure application that can grow with your user base. This setup allows you to focus on building great features, while Google Cloud and Firebase handle the underlying infrastructure.
