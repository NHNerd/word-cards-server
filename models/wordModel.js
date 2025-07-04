import mongoose from 'mongoose';
import DateSchema from './schemas/dateSchema.js';

const wordSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  },
  createDate: DateSchema,
  word: {
    type: String,
    required: [true, 'Enter a word'],
  },
  updateWord: {
    type: Date,
    default: Date.now,
  },
  translate: {
    type: String,
    required: [true, 'Enter a translate or description'],
  },
  updateTranslate: {
    type: Date,
    default: Date.now,
  },
  correct: {
    type: Number,
    default: 0,
  },
  wrong: {
    type: Number,
    default: 0,
  },
  know: {
    type: Boolean,
    default: false,
  },
  updateKnow: {
    type: Date,
    default: Date.now,
  },
  // createdDate: {
  //   type: Date,
  //   default: Date.now,
  // },
});

const WordModel = mongoose.model('Word', wordSchema); //? User - the collection name

export default WordModel;

//? This is class the mongoose.Model instance that inherit all of its methods:
//? WordModel.create,
//? WordModel.find,
//? WordModel.update,
//? WordModel.delete , and so on...
