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
        return res.status(409).json({ message: 'List "' + listName + '" already exists :(' });
      }

      // Update all existing lists for this user, incrementing their order by 1
      const allLists = await ListModel.updateMany({ userId }, { $inc: { order: 1 } }).session(session);

      // Create the new list with order 0
      const list = await ListModel.create(
        [
          {
            userId,
            listName,
            order: 0,
            gameCount: 12,
          },
        ],
        { session }
      );

      // const listDTO = list;
      const listDTO = list[0].toObject();
      delete listDTO.userId;
      delete listDTO.__v;

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ message: 'list added success :) \n' + listDTO.listName, listDTO });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  async addSync(req, res) {
    try {
      const { userId, lists } = req.body;
      console.log(lists);
      const listsCorrect = lists.map((item) => ({
        _id: item._id,
        userId: userId,
        listName: item.listName,
        order: item.order,
        gameCount: item.gameCount,
      }));

      const addedLists = await ListModel.create(listsCorrect);

      const addedListsDTO = addedLists.map((list) => {
        const listObj = list.toObject();
        delete listObj.userId;
        delete listObj.__v;
        return listObj;
      });

      return res
        .status(201)
        .json({ message: 'list(s) from LS added to DB success :) \n', addedListsDTO });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      let allLists = await ListModel.find({ userId: userId })
        .sort({ order: 1 })
        .select('-__v -userId -createdDate');

      if (!allLists || allLists.length === 0)
        return res.status(404).json({ message: 'No lists found for this user' });

      //* Check is orders correct (Haves 0 oreder & step = 1)
      // const isOrderCorrect = allLists.every((list, index) => list.order === index);
      // if (!isOrderCorrect) {
      //   // Mongoos приколы, из GPT копипаст
      //   allLists = allLists.map((list, index) => ({
      //     ...list._doc, // сохраняем остальные поля
      //     order: index, // задаем новый порядок
      //     updateOrder: new Date().toISOString(), // обновляем updateOrder с текущим временем в формате ISO 8601
      //   }));
      //   const bulkUpdates = allLists.map((list) => ({
      //     updateOne: {
      //       filter: { _id: list._id },
      //       update: { order: list.order },
      //     },
      //   }));
      //   if (bulkUpdates.length > 0) {
      //     await ListModel.bulkWrite(bulkUpdates);
      //   }
      // }

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
      const lists = req.body;

      for (let i = 0; i < lists.length; i++) {
        const { _id, order, updateOrder } = lists[i];
        await ListModel.updateOne({ _id }, { $set: { order: order, updateOrder: updateOrder } }).session(
          session
        );
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
  async patchListField(req, res) {
    try {
      const { _id, field, updateTime } = req.body;

      if (!_id || !field || !updateTime) {
        return res
          .status(400)
          .json({ message: 'Invalid request: _id and field and updateTime are required' });
      }
      const existingList = await ListModel.findById(_id);
      if (!existingList) {
        return res.status(404).json({ message: 'List not found in DB' });
      }

      let messageName = 'List name';
      if (isNaN(Number(field))) {
        // String - list name
        await ListModel.updateOne({ _id }, { $set: { listName: field, updateListName: updateTime } });
      } else {
        // Number - game count
        await ListModel.updateOne({ _id }, { $set: { gameCount: field, updateGameCount: updateTime } });
        messageName = 'Game count';
      }

      return res.status(200).json({ message: `${messageName} "${field}" updated successfully` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async refreshOrdersSync(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const DTOupdateDB_allOrder = req.body;
      // console.log(DTOupdateDB_allOrder);

      for (let i = 0; i < DTOupdateDB_allOrder.length; i++) {
        const { _id, order, updateOrder } = DTOupdateDB_allOrder[i];
        // console.log('_id, ', _id, 'updateOrder: ', updateOrder);

        await ListModel.updateOne({ _id }, { $set: { order: order, updateOrder: updateOrder } }).session(
          session
        );
      }

      await session.commitTransaction();

      return res.status(200).json({ message: 'Lists orders updated successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    } finally {
      session.endSession();
    }
  }
  async refreshFieldsSync(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const lists = req.body;

      for (let i = 0; i < lists.length; i++) {
        const { _id, listName, updateListName, gameCount, updateGameCount } = lists[i];

        await ListModel.updateOne(
          { _id },
          {
            $set: {
              listName: listName,
              updateListName: updateListName,
              gameCount: gameCount,
              updateGameCount: updateGameCount,
            },
          }
        ).session(session);
      }

      await session.commitTransaction();

      return res.status(200).json({ message: 'Fields updated successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    } finally {
      session.endSession();
    }
  }

  async delete(req, res) {
    try {
      const { userId, _id, updateOrder } = req.params;

      const candidateList = await ListModel.findOne({ userId, _id });
      if (!candidateList) {
        return res.status(404).json({ message: 'List with _id"' + _id + '" is not exists :(' });
      }

      // Удаляем список
      const delitedList = await ListModel.deleteOne({ userId, _id });

      // Уменьшить order для всех элементов с order > deletedOrder
      const updatedOrderLists = await ListModel.updateMany(
        { userId, order: { $gt: candidateList.order } },
        { $inc: { order: -1 } }
      );
      console.log(`updatedOrderLists =  "${updatedOrderLists}`);
      // Новое значение для updateOrder
      const updatedAllLists = await ListModel.updateMany({ userId }, { updateOrder: updateOrder });
      console.log(`updatedAllLists =  "${updatedAllLists}`);

      return res
        .status(200)
        .json({ message: `List "${candidateList.listName}" with id "${_id}" deleted successfully.` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteMany(req, res) {
    try {
      const { _id, userId } = req.body;

      const existingLists = await ListModel.find({ userId, _id: { $in: _id } });
      if (existingLists.length === 0) {
        return res.status(409).json({
          message: 'All lists with the provided _id are already deleted in DB.',
        });
      }

      const deletedLists = await ListModel.deleteMany({
        userId,
        _id: { $in: existingLists },
      });

      //! НУжно обновить им ордера
      // //* Change orders after delete
      // // Находим все оставшиеся элементы, которые не были удалены
      // const remainingLists = await ListModel.find({
      //   userId,
      //   _id: { $nin: _id },
      // }).sort({ order: 1 }); // Сортируем по порядку
      // // Перезаписываем порядок оставшихся элементов
      // const bulkUpdates = remainingLists.map((list, index) => ({
      //   updateOne: {
      //     filter: { _id: list._id },
      //     update: {
      //       order: index, // новый порядок
      //       updateOrder: new Date().toISOString(), // новое время обновления
      //     },
      //   },
      // }));
      // // Выполняем bulk-обновления для изменения порядка
      // if (bulkUpdates.length > 0) {
      //   await ListModel.bulkWrite(bulkUpdates);
      // }

      return (
        res
          .status(200)
          //? deletedCount - mongo DB method
          .json({ message: `All lists(${deletedLists.deletedCount}) deleted successfully.` })
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new ListController();
