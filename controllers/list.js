import mongoose from 'mongoose';
import ListModel from '../models/listModel.js';

class ListController {
  async add(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId, listName } = req.body;

      // check: is existe list with this name && userId
      const candidate = await ListModel.findOne({ userId, listName }).session(session);
      if (candidate) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({ message: 'List with this name already exists :(' });
      }

      // Update all existing lists for this user, incrementing their order by 1
      const allLists = await ListModel.updateMany({ userId }, { $inc: { order: 1 } }).session(session);
      console.log(allLists);
      // Create the new list with order 0
      const list = await ListModel.create(
        [
          {
            userId,
            listName,
            updateListName: new Date(),
            order: 0,
            updateOrder: new Date(),
            gameCount: 12,
            updateGameCount: new Date(),
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ message: 'list added success :) \n' + list[0].listName, list });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      const allLists = await ListModel.find({ userId: userId })
        .sort({ order: 1 })
        .select('-__v -userId -createdDate');

      if (!allLists || allLists.length === 0)
        return res.status(404).json({ message: 'No lists found for this user' });

      return res.status(200).json({ allLists: allLists });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async refreshOrders(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { lists, removedListLS } = req.body;

      if (removedListLS) {
        await ListModel.deleteOne({ _id: removedListLS[0]._id }).session(session);
      }

      // change fill order
      for (let i = 0; i < lists.length; i++) {
        const { _id, order } = lists[i];
        await ListModel.updateOne({ _id }, { $set: { order: order } }).session(session);
      }

      await session.commitTransaction();

      return res.status(200).json({ message: 'Lists updated successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    } finally {
      session.endSession();
    }
  }
}

export default new ListController();
