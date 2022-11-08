import { Request, Response, Router } from 'express';

import { users } from 'models/user';
import getUserById from '../service/user.service';

const router = Router();

/**
 * Get user information by user_id
 * @auth required
 * @route {GET} /getUserById/:user_id
 * @queryparam user_id User ID
 * @returns user: matching the user_id
 */
router.get(
  '/getUserById/:user_id',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.user_id;
      const user: users | null = await getUserById(userId);

      if (!user) {
        res.status(404).json({ message: 'user does not exit' });
        return;
      } else {
        return res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export default router;
