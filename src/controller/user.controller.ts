import { NextFunction, Request, Response, Router } from 'express';

import getAllUsersCount from '../service/sample.service';

const router = Router();

/**
 * @route {GET} /getUsersCount
 * @returns number: total count of users
 */
router.get(
  '/getUsersCount',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getAllUsersCount();

      res.status(200).json({ totalUsers: users });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
