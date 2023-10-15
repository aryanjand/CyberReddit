import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummy = await prisma.user.upsert({
    where: { email: 'dummy@mail.com' },
    update: {},
    create: {
      email: 'dummy@mail.com',
      firstName: 'Dummy',
      lastName: 'User',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      username: 'dummy',
      profilePicture:
        'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg',
    },
  });

  const oscar = await prisma.user.upsert({
    where: { email: 'oscar@gmail.com' },
    update: {},
    create: {
      email: 'oscar@mail.com',
      firstName: 'Oscar',
      lastName: 'Zhu',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      username: 'oscar',
      profilePicture:
        'https://i1.sndcdn.com/avatars-000289303766-rx3hqe-t500x500.jpg',
    },
  });

  const aryan = await prisma.user.upsert({
    where: { email: 'aryan@mail.com' },
    update: {},

    create: {
      email: 'aryan@mail.com',
      firstName: 'Aryan',
      lastName: 'Rand',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      username: 'aryan',
      profilePicture:
        'https://e-cdn-images.dzcdn.net/images/cover/0deaf901c342a234d16ab55d65b44b81/264x264-000000-80-0-0.jpg',
    },
  });

  console.log({ dummy, oscar, aryan });
}

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
