import { Router } from 'express';

import UserController from '../controllers/user.js';

const routerUser = new Router();

routerUser.post('/registration', UserController.registration);
routerUser.post('/login', UserController.login);
routerUser.get('/userData', UserController.userData);
routerUser.get('/emailById', UserController.emailById);

export default routerUser;
