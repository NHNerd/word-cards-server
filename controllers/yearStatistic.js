import mongoose from 'mongoose';
import YearStatisticModel from '../models/yearStatisticModel.js';

class YearStatistic {
  async update(req, res) {
    try {
      const { userId, dayOfYear, dayStatistic } = req.body;

      // const userId = '64a7bc1234567890abcdef'; // ID пользователя
      // const dayOfYear = 42; // Например, 42-й день года (11 февраля)
      // const dayStatistic = {
      //   wordsAdded: 5,
      //   sessionPlayed: 2,
      //   wordsPlayed: 10,
      // };

      const result = await YearStatistic.findOneAndUpdate(
        { userId, year: currentYear },
        {
          $set: {
            [`wordsAdded.${dayOfYear}`]: dayStatistic,
          },
        },
        { upsert: true, new: true } // Создает документ, если его нет
      );

      return res
        .status(200)
        .json({ message: `Word "${candidateList.word}" with id "${_id}" deleted successfully.` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new YearStatistic();
