import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'Test User 1',
      username: 'user1',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Test User 2',
      username: 'user2',
    },
  })

  const post1 = await prisma.post.create({
    data: {
      title: 'Post 1',
      slug: 'post-1',
      content: 'This is the first post',
      authorId: user1.id,
      publishedAt: new Date(),
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Post 2',
      slug: 'post-2',
      content: 'This is the second post',
      authorId: user2.id,
      publishedAt: new Date(),
    },
  })

  await prisma.comment.create({
    data: {
      content: 'This is a comment on the first post',
      authorId: user2.id,
      postId: post1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'This is a comment on the second post',
      authorId: user1.id,
      postId: post2.id,
    },
  })

  await prisma.like.create({
    data: {
      target: 'POST',
      userId: user1.id,
      postId: post2.id,
    },
  })

  await prisma.bookmark.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
