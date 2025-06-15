import statisticModel from '../models/statisticModel.js';

class StatisticController {
  async patchSessionDays(req, res) {
    try {
      const { userId, session } = req.body;

      if (!userId || !Array.isArray(session) || session.length === 0) {
        return res.status(400).json({ message: 'Invalid input data (userId or session)' });
      }

      // const YMDfromDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

      const todayDate = session[session.length - 1].date;
      const year = todayDate.split('-')[0];

      const statisticCollection = await statisticModel.findOne({ userId, year });

      let statistic;
      let status = 200;
      let message = '';

      if (!statisticCollection) {
        //? Collection don't exist => create ➕
        statistic = await statisticModel.create({
          userId: userId,
          year: year,
          days: session,
        });
        status = 201;
        message = `collection statistic - ${year} created`;
      } else {
        let isNeedSort = false;
        for (let i = 0; i < session.length; i++) {
          const day = session[i].date;
          const lastDateInDB =
            statisticCollection.days[statisticCollection.days.length - 1]?.date || '1970-01-01';
          if (new Date(day).getTime() > new Date(lastDateInDB).getTime()) {
            //? day > last day in DB => push new Day✈️
            statisticCollection.days.push(session[i]);
          } else {
            //? day < last day in DB => add new || patch existe🔧
            const alreadyExistDay = statisticCollection.days.find((item) => item.date === day);

            if (alreadyExistDay) {
              //? (day < last) && exist => PATCH
              alreadyExistDay.session += session[i].session;
              alreadyExistDay.timeSec += session[i].timeSec;
              alreadyExistDay.comboMax = Math.max(alreadyExistDay.comboMax, session[i].comboMax);
              alreadyExistDay.correct += session[i].correct;
              alreadyExistDay.wrong += session[i].wrong;
            } else {
              //? (day < last) && not exist => push && sort
              statisticCollection.days.push(session[i]);
              isNeedSort = true;
            }
          }
        }

        if (isNeedSort) statisticCollection.days.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Mark as modified & save
        statisticCollection.markModified('days');
        statistic = await statisticCollection.save();

        message = `collection statistic - updated (${session.length} day${session.length > 1 ? 's' : ''})`;
      }

      return res.status(status).json({ message, statistic });
    } catch (error) {
      console.error('⚠️ Error in patchSessionDay:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async patchAddWord(req, res) {
    try {
      const { userId, wordAdded } = req.body;

      if (!userId || !wordAdded) {
        return res.status(400).json({ message: 'Invalid input data (userId or session)' });
      }

      const todayDate = wordAdded[wordAdded.length - 1].date;
      const year = todayDate.split('-')[0];

      const statisticCollection = await statisticModel.findOne({ userId, year });

      let statistic;
      let status = 200;
      let message = '';

      if (!statisticCollection) {
        //? Collection don't exist => create ➕
        statistic = await statisticModel.create({
          userId: userId,
          year: year,
          days: wordAdded,
        });
        status = 201;
        message = `collection statistic - ${year} created`;
      } else {
        let isNeedSort = false;
        for (let i = 0; i < wordAdded.length; i++) {
          const day = wordAdded[i].date;
          const lastDateInDB =
            statisticCollection.days[statisticCollection.days.length - 1]?.date || '1970-01-01';
          if (new Date(day).getTime() > new Date(lastDateInDB).getTime()) {
            //? day > last day in DB => push new Day✈️
            statisticCollection.days.push(wordAdded[i]);
          } else {
            //? day < last day in DB => add new || patch existe🔧
            const alreadyExistDay = statisticCollection.days.find((item) => item.date === day);

            if (alreadyExistDay) {
              //? (day < last) && exist => PATCH
              alreadyExistDay.wordAdd += wordAdded[i].wordAdded;
            } else {
              //? (day < last) && not exist => push && sort
              statisticCollection.days.push(wordAdded[i]);
              isNeedSort = true;
            }
          }
        }

        if (isNeedSort) statisticCollection.days.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Mark as modified & save
        statisticCollection.markModified('days');
        statistic = await statisticCollection.save();

        message = `collection statistic - updated (${wordAdded.length} day${wordAdded.length > 1 ? 's' : ''})`;
      }

      return res.status(status).json({ message, statistic });
    } catch (error) {
      console.error('⚠️ Error in patchSessionDay:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getStatistic(req, res) {
    try {
      const { userId } = req.query;

      let statistic = await statisticModel.find({ userId }).select('-__v -userId -createdDate');

      if (!statistic || statistic.length === 0)
        return res.status(404).json({ message: 'No statistic found for this user' });

      return res.status(200).json({ statistic });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new StatisticController();
