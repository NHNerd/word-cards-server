import { Router } from 'express';

import WordController from '../controllers/word.js';

const routerWord = new Router();

routerWord.post('/add', WordController.add);
routerWord.post('/addBulk', WordController.addBulk);
routerWord.get('/getAll', WordController.getAll);
routerWord.patch('/patchWordField', WordController.patchWordField);

export default routerWord;
