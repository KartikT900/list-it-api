import { Router } from 'express';

import authController from './controller/auth.controller';
import userController from './controller/user.controller';

const router = Router().use(authController).use(userController);

export default (baseUrl: string) => Router().use(baseUrl, router);
