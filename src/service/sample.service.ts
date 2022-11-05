import prisma from '../prismaClient';

async function getAllUsersCount() {
  const userCount: number = await prisma.users.count();

  return userCount;
}

export default getAllUsersCount;
