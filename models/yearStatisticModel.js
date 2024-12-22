import mongoose from 'mongoose';

const YearStatisticSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
  wordsAdded: {
    type: Array,
    default: [
      {
        data: Date.now,
        wordsAdded: 0,
        sessionPlayed: 0,
        wordsPlayed: 0,
      },
      {
        data: Date.now,
        wordsAdded: 0,
        sessionPlayed: 0,
        wordsPlayed: 0,
      },
    ],
  },
});

// Устанавливаем индекс для уникальности комбинации userId + year
YearStatisticSchema.index({ userId: 1, year: 1 }, { unique: true });

const YearStatisticModel = mongoose.model('YearStatistic', YearStatisticSchema); //? User - the collection name

export default YearStatisticModel;
