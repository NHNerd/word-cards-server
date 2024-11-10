import { Router } from 'express';

import WordController from '../controllers/word.js';

const routerWord = new Router();

routerWord.post('/add', WordController.add);
routerWord.post('/addBulk', WordController.addBulk);
routerWord.get('/getAll', WordController.getAll);
routerWord.get('/getAllListWords', WordController.getAllListWords);

export default routerWord;
