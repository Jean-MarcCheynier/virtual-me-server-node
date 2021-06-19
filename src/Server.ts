/* eslint-disable @typescript-eslint/no-unsafe-return */
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mongoose from 'mongoose';
import promise from 'bluebird';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import  passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import baseRouter, { authRouter, connectorRouter } from './routes';
import logger from '@shared/Logger';
import UserDao, { IUserDao } from './daos/User/UserDao';
import { IUser } from './entities/User';
import { SAPCAI } from './services/SAPCAI';

const app = express();
const httpServer = createServer(app);

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
 *                              Serve front-end content
 ***********************************************************************************/
SAPCAI.getToken()


/************************************************************************************
 *                              Set passport settings
 ***********************************************************************************/
const userDao: IUserDao = new UserDao();

passport.use(new Strategy({
    jwtFromRequest: (request: any) => {
        let token = null;
        try {
            console.log("try to find the token as string");
            token = ExtractJwt.fromAuthHeaderWithScheme('bearer')(request)
        } catch (e) {
            console.log("not found");
        }
        if (!token) {
            console.log("try to find it in auth arg");
            if (request.auth) {
                
                token = request.auth.token;
            }
        } else {
            console.log("Token found in auth header");
        }
        console.log(token);
        return token
    },
    secretOrKey: process.env.JWT_SECRET
    // audience = 'yoursite.net';
},
(jwtPayload: any, done: (err: any, user?: IUser) => boolean) => {
    console.log("passport")
    userDao.getOne({ _id: jwtPayload._id })
        .then((user: any) => {
            console.log("Passport Success")
            done(null, user)
            return true
        })
        .catch((error: any) => {
            console.log("Passport Error")
            done(error)
            return false
        })
}))

/************************************************************************************
 *                              Set Socket.io Config
 ***********************************************************************************/
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const wrap = (middleware: any) => (socket: any, next: any) => {
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (socket.handshake && socket.handshake.auth) {
        socket.request.auth = socket.handshake.auth;
    }
    
    return middleware(socket.request, {}, next);
}

const options = {
    cors: {
        origin: "*",//process.env.CLIENT_URL
        //methods: ['GET', 'POST']
    }
};
export const io = new Server(httpServer, options);
//io.use(wrap(myMiddleWare));

io.use(wrap(passport.authenticate(['jwt'], (data, err) => {
    console.log("CB passport")
    console.log(data)
    console.log(err)
    //console.log(args)
})));

io.on("connection", (socket) => {
    // ...
    console.log("Connected")
});

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
app.use('/api/auth', authRouter)
app.use('/api/connector', connectorRouter)
app.all('/api/*', passport.authenticate('jwt', { session: false }))
app.use('/api', baseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});



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
export default httpServer;
