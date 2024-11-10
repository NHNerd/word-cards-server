import mongoose from 'mongoose';

const ListSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  listName: {
    type: String,
    required: [true, 'Enter a list name'],
  },
  updateListName: {
    type: Date,
    default: Date.now,
  },
  order: Number,
  updateOrder: {
    type: Date,
    default: Date.now,
  },
  gameCount: Number,
  updateGameCount: {
    type: Date,
    default: Date.now,
  },
});

const ListModel = mongoose.model('List', ListSchema); //? User - the collection name

export default ListModel;

//? This is class the mongoose.Model instance that inherit all of its methods:
//? ListModel.create,
//? ListModel.find,
//? ListModel.update,
//? ListModel.delete , and so on...
