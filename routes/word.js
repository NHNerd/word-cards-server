import { Router } from 'express';

import WordController from '../controllers/word.js';

const routerWord = new Router();

routerWord.post('/add', WordController.add);
routerWord.post('/addBulk', WordController.addBulk);
routerWord.get('/getAll', WordController.getAll);
routerWord.patch('/patchWordField', WordController.patchWordField);
routerWord.patch('/patchWordFielCorrectWrongdMany', WordController.patchWordFielCorrectWrongdMany);
routerWord.delete('/delete/:userId/:_id', WordController.delete);

export default routerWord;
