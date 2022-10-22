import prisma from '../../prisma/prismaClient';

async function getAllUsers() {
  const users = await prisma.users.findMany();

  return users;
}

export default getAllUsers;
