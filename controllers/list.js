import ListModel from '../models/listModel.js';

class ListController {
  async add(req, res) {
    try {
      const { userId, listName } = req.body;

      // check: is existe list with this name && userId
      const candidate = await ListModel.findOne({ listName: listName, userId: userId });
      if (candidate) return res.status(409).json({ message: 'List with this name already exists :(' });

      const list = await ListModel.create({
        userId: userId,
        listName: listName,
        createdDate: new Date(),
        order: 0,
        gameCount: 10,
      });

      return res.status(200).json({ message: 'list added success :) \n' + list });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      const allLists = await ListModel.find({ userId: userId });

      if (!allLists || allLists.length === 0) {
        return res.status(404).json({ message: 'No lists found for this user' });
      }
      return res.status(200).json({ allLists: allLists });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async refreshOrders(req, res) {
    try {
      const lists = req.body;

      for (let i = 0; i < lists.length; i++) {
        const _id = lists[i]._id;
        await ListModel.updateOne({ _id }, { $set: { order: lists[i].order } });
      }

      return res.status(200).json({ message: 'Lists updated successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new ListController();
