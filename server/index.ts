import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import router from './router';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());
app.use(session({ secret: "abcde12345", resave: false, saveUninitialized: true}));
app.use(compression());
app.use(cookieParser());
app.use('/', router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server is running on port 8080');
});
const MONGO_URL = 'mongodb+srv://harshvardhan23007:3gtQgfiUUd1z0fiQ@cluster0.xgklla1.mongodb.net/?retryWrites=true&w=majority'; // DB URI

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

