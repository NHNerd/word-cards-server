import { Router } from 'express';

import ListController from '../controllers/list.js';

const routerList = new Router();

routerList.post('/add', ListController.add);
routerList.post('/addSync', ListController.addSync);
routerList.get('/getAll', ListController.getAll);
routerList.put('/refreshOrders', ListController.refreshOrders);
routerList.put('/refreshOrdersSync', ListController.refreshOrdersSync);
routerList.put('/refreshFieldsSync', ListController.refreshFieldsSync);
routerList.patch('/patchListField', ListController.patchListField);
routerList.patch('/patchListSessionCount', ListController.patchListSessionCount);

routerList.delete('/delete/:userId/:_id/:updateOrder', ListController.delete);
routerList.post('/deleteMany', ListController.deleteMany);

export default routerList;
