import mongoose from 'mongoose';

const DateSchema = new mongoose.Schema(
  {
    utcMS: {
      type: Number,
      required: true,
    },
    utcOffsetMS: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // отключаем _id для вложенного объекта

export default DateSchema;
