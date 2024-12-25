import mongoose from 'mongoose';
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
      delete newWordDTO.userId;
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
        delete wordDTO.userId;
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

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      const allWords = await WordModel.find({ userId }).select('-__v -userId');

      if (!allWords || allWords.length === 0) {
        return res.status(404).json({ message: 'No words found for this user' });
      }

      return res.status(200).json({ allWords });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async patchWordField(req, res) {
    try {
      const { userId, _id, word, translate, updateWord, updateTranslate } = req.body;

      if (!userId || !_id || !word || !translate || !updateWord || !updateTranslate) {
        return res.status(400).json({
          message:
            'Invalid request: userId, _id, word, translate, updateWord, updateTranslate are required',
        });
      }

      const existingWord = await WordModel.findById(_id);
      if (!existingWord) {
        return res.status(404).json({ message: 'Word not found in DB' });
      }

      let messageName = 'Word & translate';

      const newUpdateWord = new Date(updateWord);
      const newUpdateTranslate = new Date(updateTranslate);

      if (existingWord.updateWord < newUpdateWord && existingWord.updateTranslate < newUpdateTranslate) {
        await WordModel.updateOne(
          { _id },
          {
            $set: {
              word: word,
              updateWord: newUpdateWord,
              translate: translate,
              updateTranslate: newUpdateTranslate,
            },
          }
        );
      } else {
        if (existingWord.updateWord < newUpdateWord) {
          await WordModel.updateOne({ _id }, { $set: { word: word, updateWord: newUpdateWord } });
          messageName = 'Word';
        }
        if (existingWord.updateTranslate < newUpdateTranslate) {
          await WordModel.updateOne(
            { _id },
            { $set: { translate: translate, updateTranslate: newUpdateTranslate } }
          );
          messageName = 'Translate';
        }
      }

      return res.status(200).json({ message: `${messageName} updated successfully` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async patchWordFielCorrectWrongdMany(req, res) {
    try {
      const { listWordsNewDTO } = req.body;

      if (listWordsNewDTO.length1 === 0) {
        return res.status(400).json({
          message: 'Invalid request:  DTO words array are required',
        });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      const existingWords = await WordModel.find({ listId: { $in: listWordsNewDTO[0].listId } });
      if (existingWords.length === 0) {
        return res.status(409).json({
          message: "Words don't exist in DB.(patch fields many)",
        });
      }
      // console.log(listWordsNewDTO);

      for (let i = 0; i < listWordsNewDTO.length; i++) {
        const { _id, listId, correct, wrong } = listWordsNewDTO[i];

        await WordModel.updateOne(
          { _id },
          {
            $set: {
              correct: correct,
              wrong: wrong,
            },
          }
        ).session(session);
      }

      await session.commitTransaction();

      return (
        res
          .status(200)
          //? deletedCount - mongo DB method
          .json({
            message: `All words updated(wrong/correct) successfully :)`,
          })
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const { userId, _id } = req.params;

      const candidateList = await WordModel.findOne({ userId, _id });
      if (!candidateList) {
        return res.status(404).json({ message: 'Word with _id"' + _id + '" is not exists :(' });
      }

      await WordModel.deleteOne({ userId, _id });

      return res
        .status(200)
        .json({ message: `Word "${candidateList.word}" with id "${_id}" deleted successfully :)` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new WordController();
