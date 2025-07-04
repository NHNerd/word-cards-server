import { Router } from 'express';

import StatisticController from '../controllers/statistic.js';

const routerStatistic = new Router();

routerStatistic.patch('/patchSessionDays', StatisticController.patchSessionDays);
routerStatistic.patch('/patchAddWord', StatisticController.patchAddWord);
routerStatistic.get('/getStatistic', StatisticController.getStatistic);

export default routerStatistic;
