import { User } from 'models/User';
import prisma from '../prismaClient';

async function getUserById(userId: string): Promise<User | null> {
  const user: User | null = await prisma.user.findUnique({
    where: {
      user_id: userId
    }
  });

  // we do not want to send back password property
  delete user?.password;

  return user;
}

export default getUserById;
