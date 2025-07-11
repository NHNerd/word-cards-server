import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; //? for success connect from client with current Url
import dotenv from 'dotenv';
import routerUser from './routes/user.js';
import routerList from './routes/list.js';
import routerWord from './routes/word.js';
import routerStatistic from './routes/statistic.js';

// import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

//midlware
app.use(express.json());
// app.use(cookieParser());
app.use(
  cors({
    credentials: true, //? provede cookies
    origin: '*', // for all
    // origin: [
    //   'http://192.168.1.131:5173',
    //   'http://localhost:5173',
    //   'http://192.168.1.4:5173',
    //   'http://192.168.1.5:5173',
    //   'http://192.168.1.6:5173',
    //   'http://192.168.1.7:5173',
    //   'http://172.19.0.1:5173',
    //   'http://192.168.1.45:5173',
    //   'http://192.168.1.45:5174',
    //   'https://nhnerd.github.io',
    // ],
  })
);
app.use('/apiUser', routerUser);
app.use('/apiList', routerList);
app.use('/apiWord', routerWord);
app.use('/apiStatistic', routerStatistic);

// Connect mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB is connected');
    // Start seerver
    app.listen(PORT, HOST, () => {
      console.log(`server is running: http://${HOST}:${PORT}`);
    });

    return;
  })
  .catch((error) => {
    console.log('mongoDB connection ERROR: \n' + error);
    return;
  });
