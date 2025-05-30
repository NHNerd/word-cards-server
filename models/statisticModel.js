import mongoose from 'mongoose';

const DaySchema = new mongoose.Schema({
  date: { type: String, required: true },
  wordAdd: { type: Number, default: 0 },
  session: { type: Number, default: 0 },
  timeSec: { type: Number, default: 0 },
  comboMax: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
});

const statisticSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  days: { type: [DaySchema], default: [] },
});

const StatisticModel = mongoose.model('Statistic', statisticSchema); //? User - the collection name

export default StatisticModel;

//? This is class the mongoose.Model instance that inherit all of its methods:
//? WordModel.create,
//? WordModel.find,
//? WordModel.update,
//? WordModel.delete , and so on...
