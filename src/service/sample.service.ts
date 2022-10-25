import prisma from '../prismaClient';

async function getAllUsers() {
  const users = await prisma.users.findMany();

  return users;
}

export default getAllUsers;
