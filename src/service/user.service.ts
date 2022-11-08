import { users } from 'models/user';
import prisma from '../prismaClient';

async function getUserById(userId: string): Promise<users | null> {
  const user: users | null = await prisma.users.findUnique({
    where: {
      user_id: userId
    }
  });

  // we do not want to send back password property
  delete user?.password;

  return user;
}

export default getUserById;
