/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import passportGithub from 'passport-github';
import OAuth2Strategy from 'passport-oauth2'

import baseRouter, { authRouter, connectorRouter } from './routes';
import logger from '@shared/Logger';
import UserDao, { IUserDao } from './daos/User/UserDao';
import { IUser } from '@virtual-me/virtual-me-ts-core';
import { SAPCAI } from './services/SAPCAI';
import User, { IUserDocument } from './schemas/User';

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

const mongoURI: string = process.env.MONGO_URI || "";
mongoose.connect(mongoURI, dbOptions)
const db = mongoose.connection
db.on('error', () => logger.error('connection error:'))
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
        // Case request from http
        let token = ExtractJwt.fromAuthHeaderWithScheme('bearer')(request)
        logger.debug("search token")
        if (token) {
            logger.debug("token from header")
            return token;
        } else {
            logger.debug("token from req")
            token = request?.auth?.token;
            // Case request from ws
            return token
        }

    },
    secretOrKey: process.env.JWT_SECRET
    // audience = 'yoursite.net';
},
(jwtPayload: any, done: (err: any, user?: IUser) => boolean) => {
    userDao.getOne({ _id: jwtPayload._id })
        .then((user: any) => {
            done(null, user)
            return true
        })
        .catch((error: any) => {
            done(error)
            return false
        })
    }))

passport.use(new passportGithub.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: process.env.GITHUB_CALLBACK_URL || ""
    },
    (accessToken, refreshToken, profile, cb) => {
        const { id, displayName, username, profileUrl, photos, provider } = profile;
        userDao.signinWithGithub(profile)
            .then((user) => {
                cb(null, user)
            })
    }
));

/************************************************************************************
 *                              Set Socket.io Config
 ***********************************************************************************/

const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);

const options = {
    cors: {
        origin: "*",//process.env.CLIENT_URL
        //methods: ['GET', 'POST']
    }
};
export const io = new Server(httpServer, options);
io.use((socket: any, next) => {
    logger.debug("socket");
    if (socket.handshake && socket.handshake.auth) {
        logger.debug("handshake");
        logger.debug(JSON.stringify(socket.handshake));
        socket.request.auth = socket.handshake.auth;
    } else {
        logger.debug("handshake failed");
    }
    next()
})
io.use(wrap(passport.initialize()));
io.use(wrap(passport.authenticate('jwt', { session: false })));
io.use((socket: any, next) => {
    if (socket.request.user) {
        logger.info(socket.request.user)
        next();
    } else {
        logger.error("Unauthorized")
        next(new Error("unauthorized"))
    }
});

io.on("connection", (socket: any) => {
    const user: IUser = socket.request.user;
    const socketId = socket.id;
    logger.info(socketId);
    userDao.updateSocketId(user, socketId)
    //Remove socketId on disconnect
    socket.on('disconnect', function (socket: any) {
        const socketId: string = socket.id
        logger.debug(`Disconnected : ${socketId}`)
        userDao.updateSocketId(user, "")
    });
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
    logger.error(err);
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
