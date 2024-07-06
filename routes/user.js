import { Router } from 'express';

import UserController from '../controllers/user.js';

const routerUser = new Router();

routerUser.post('/registration', UserController.registration);
routerUser.get('/userData', UserController.userData);

export default routerUser;
