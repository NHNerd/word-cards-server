import mongoose from 'mongoose';

const wordSchema = mongoose.Schema({
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  },
  word: {
    type: String,
    required: [true, 'Enter a word'],
  },
  translate: {
    type: String,
    required: [true, 'Enter a translate or description'],
  },
  createdDate: {
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
  status: {
    type: Number,
    default: 0,
  },
});

// Создать уникальный индекс для поля listName в пределах каждого пользователя
// wordSchema.index({ user: 1, listName: 1 }, { unique: true });

const WordModel = mongoose.model('Word', wordSchema); //? User - the collection name

export default WordModel;

//? This is class the mongoose.Model instance that inherit all of its methods:
//? WordModel.create,
//? WordModel.find,
//? WordModel.update,
//? WordModel.delete , and so on...