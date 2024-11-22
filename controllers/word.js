import WordModel from '../models/wordModel.js';

class WordController {
  async add(req, res) {
    try {
      const { userId, listId, word, translate } = req.body;

      // check: is existe this word
      const candidate = await WordModel.findOne({ userId: userId, listId: listId, word: word });
      if (candidate)
        return res
          .status(409)
          .json({ message: `Word "${word}" already exists for user "${userId}" in lsit "${listId}":(` });

      const newWord = await WordModel.create({
        userId: userId,
        listId: listId,
        word: word,
        updateWord: new Date(),
        translate: translate,
        updateTranslate: new Date(),
        updateStatus: new Date(),
      });

      const newWordDTO = newWord.toObject();
      delete newWordDTO.__v;

      return res
        .status(201)
        .json({ message: 'word "' + newWord.word + '" added success :) \n', newWord: newWordDTO });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async addBulk(req, res) {
    try {
      const { userId, listId, words } = req.body;

      if (!Array.isArray(words) || words.length === 0)
        return res.status(400).json({ message: `Invalid input: words must be a non-empty array :(` });

      const newWords = await WordModel.insertMany(
        words.map(({ word, translate }) => ({
          userId: userId,
          listId: listId,
          word: word,
          translate: translate,
        }))
      );

      const newWordsDTO = newWords.map((newWord) => {
        const wordDTO = newWord.toObject();
        delete wordDTO.__v;
        return wordDTO;
      });

      return res
        .status(201)
        .json({ message: 'bulk of words added success :) \n', newWords: newWordsDTO });
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
      // const { allListsId } = req.query;

      // const Allwords = {};
      // await Promise.all(
      //   allListsId.map(async (listId) => {
      //     const words = await WordModel.find({ listId });

      //     if (!words || words.length === 0) return;

      //     Allwords[listId] = words;
      //   })
      // );

      // if (Object.keys(Allwords).length === 0) {
      //   return res.status(404).json({ message: 'No words found for any list' });
      // }

      const { userId } = req.query;

      const allWords = await WordModel.find({ userId });

      if (!allWords || allWords.length === 0) {
        return res.status(404).json({ message: 'No words found for this user' });
      }

      return res.status(200).json({ allWords });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new WordController();
