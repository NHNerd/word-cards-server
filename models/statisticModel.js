import mongoose from 'mongoose';

const statisticSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    default: 'lastSession',
    required: [true, 'lastSession | day | week | month | year | allTime'],
  },
  duration: {
    type: Number,
    required: true,
  },
  correct: {
    type: Number,
    required: true,
  },
  wrong: {
    type: Number,
    required: true,
  },
  combo: {
    type: Number,
    required: true,
  }, // Max session combo
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const StatisticModel = mongoose.model('Statistic', statisticSchema); //? User - the collection name

export default StatisticModel;

//? This is class the mongoose.Model instance that inherit all of its methods:
//? WordModel.create,
//? WordModel.find,
//? WordModel.update,
//? WordModel.delete , and so on...
