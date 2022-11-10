import { Response, Router } from 'express';
import { Request as JWTRequest } from 'express-jwt';

import { User } from '../models/User';

import getUserById from '../service/user.service';

const router = Router();

/**
 * @auth required
 * @route {POST} /authorize
 * @returns number: total count of users
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/authorize', async (req: JWTRequest, res: Response) => {
  const user_id: string | undefined = req.auth?.sub?.split('|')[1];

  if (!user_id) {
    res.status(401).json({ message: 'invalid token' });
    return;
  }

  try {
    const userDetails: User | null = await getUserById(user_id);

    if (userDetails) {
      res.status(200).json(userDetails);
    } else {
      res.status(404).json({ message: 'user does not exist' });
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
