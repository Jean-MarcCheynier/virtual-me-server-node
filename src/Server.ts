import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import mongoose from 'mongoose';
import promise from 'bluebird';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import  passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import BaseRouter from './routes';
import logger from '@shared/Logger';

const app = express();

const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set Mongoose Config
 ***********************************************************************************/
mongoose.Promise = promise

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
logger.info('The value of PORT is:' + process.env.MONGO_URI);
const mongoURI: string = process.env.MONGO_URI || "";
mongoose.connect(mongoURI, dbOptions)
const db = mongoose.connection
db.on('error', () => logger.err('connection error:'))
db.once('open', () => logger.info('Connected to MongoDB'))




/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

/************************************************************************************
 *                              Set passport settings
 ***********************************************************************************/
/* const UserService = require('../services/UserService')


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    secretOrKey: process.env.JWT_SECRET
    // audience = 'yoursite.net';
}
passport.use(new Strategy(opts, (jwtPayload: any, done: Function) => {
    UserService.getUser(jwtPayload._id)
    .then((user: any) => {
        done(null, user)
        return true
    })
    .catch((error: any) => {
        // console.log(error);
        done(error, false)
        return false
    })
})) 
*/




/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;
