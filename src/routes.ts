import { Router } from 'express';

import authController from './controller/auth.controller';
import noteController from './controller/note.controller';
import userController from './controller/user.controller';

const router = Router()
  .use(authController)
  .use(userController)
  .use(noteController);

export default (baseUrl: string) => Router().use(baseUrl, router);
