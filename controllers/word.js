import WordModel from '../models/wordModel.js';

class WordController {
  async add(req, res) {
    try {
      const { listId, word, translate } = req.body;

      // check: is existe this word
      const candidate = await WordModel.findOne({ word: word });
      if (candidate) return res.status(409).json({ message: 'Word with this name already exists :(' });

      const newWord = await WordModel.create({
        listId: listId,
        word: word,
        translate: translate,
        createdDate: new Date(),
      });

      return res.status(200).json({ message: 'word added success :) \n' + newWord });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getAllListWords(req, res) {
    try {
      const { listId } = req.query;

      const allWords = await WordModel.find({ listId: listId });

      if (!allWords || allWords.length === 0) {
        return res.status(404).json({ message: 'No words found for this list' });
      }

      return res.status(200).json({ message: 'all words: \n' + allWords });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async getAll(req, res) {
    try {
      const { allListsId } = req.query;

      const Allwords = {};
      await Promise.all(
        allListsId.map(async (listId) => {
          const words = await WordModel.find({ listId });

          if (!words || words.length === 0) return;

          Allwords[listId] = words;
        })
      );

      if (Object.keys(Allwords).length === 0) {
        return res.status(404).json({ message: 'No words found for any list' });
      }

      return res.status(200).json({ Allwords });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new WordController();
