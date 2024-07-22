import { Router } from 'express';

import ListController from '../controllers/list.js';

const routerList = new Router();

routerList.post('/add', ListController.add);
routerList.get('/getAll', ListController.getAll);
routerList.put('/refreshOrders', ListController.refreshOrders);

export default routerList;
