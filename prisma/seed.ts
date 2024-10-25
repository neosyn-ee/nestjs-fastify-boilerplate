import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    create: {
      email: 'rossella.mascia@neosyn.it',
      name: 'Rossella',
    },
    where: { name: 'Rossella', email: 'rossella.mascia@neosyn.it' },
    update: {},
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
