import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { bios } from "./seed-data/bios.js";
import { posts } from "./seed-data/post.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.follows.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [];

  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    usersData.push({
      username: faker.internet
        .username({ firstName, lastName })
        .toLowerCase()
        .substring(0, 30),
      email: faker.internet.email({ firstName, lastName }),
      password: faker.internet.password(),
      displayName: `${firstName} ${lastName}`,
      bio: faker.helpers.arrayElement(bios),
      avatarUrl: faker.image.avatar(),
      createdAt: faker.date.past(),
    });
  }

  await prisma.user.createMany({ data: usersData });

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allUserIds = allUsers.map((u) => u.id);

  const postsData = [];
  for (const userId of allUserIds) {
    const postCount = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < postCount; j++) {
      postsData.push({
        content: faker.helpers.arrayElement(posts),
        imageUrl:
          faker.helpers.maybe(() => faker.image.url(), { probability: 0.3 }) ||
          null,
        authorId: userId,
        createdAt: faker.date.recent(),
      });
    }
  }
  await prisma.post.createMany({ data: postsData });

  const followsData = [];
  for (const userId of allUserIds) {
    const amountToFollow = faker.number.int({ min: 3, max: 10 });
    const potentialIdols = allUserIds.filter((id) => id !== userId);

    const toFollow = faker.helpers.arrayElements(
      potentialIdols,
      amountToFollow,
    );

    for (const targetId of toFollow) {
      followsData.push({
        followerId: userId,
        followingId: targetId,
      });
    }
  }

  await prisma.follows.createMany({ data: followsData });

  console.log(`Seed finalizado com sucesso!`);
  console.log(`- 100 Usuários`);
  console.log(`- ${postsData.length} Posts`);
  console.log(`- ${followsData.length} Conexões`);
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
