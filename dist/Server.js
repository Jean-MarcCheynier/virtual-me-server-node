"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const bluebird_1 = __importDefault(require("bluebird"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const routes_1 = __importStar(require("./routes"));
const Logger_1 = __importDefault(require("@shared/Logger"));
const UserDao_1 = __importDefault(require("./daos/User/UserDao"));
const SAPCAI_1 = require("./services/SAPCAI");
const app = express_1.default();
const httpServer = http_1.createServer(app);
const { BAD_REQUEST } = http_status_codes_1.default;
/************************************************************************************
 *                              Set Mongoose Config
 ***********************************************************************************/
mongoose_1.default.Promise = bluebird_1.default;
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
const mongoURI = process.env.MONGO_URI || "";
mongoose_1.default.connect(mongoURI, dbOptions);
const db = mongoose_1.default.connection;
db.on('error', () => Logger_1.default.error('connection error:'));
db.once('open', () => Logger_1.default.info('Connected to MongoDB'));
/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
SAPCAI_1.SAPCAI.getToken();
/************************************************************************************
 *                              Set passport settings
 ***********************************************************************************/
const userDao = new UserDao_1.default();
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: (request) => {
        var _a;
        // Case request from http
        let token = passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('bearer')(request);
        Logger_1.default.debug("search token");
        if (token) {
            Logger_1.default.debug("token from header");
            return token;
        }
        else {
            Logger_1.default.debug("token from req");
            token = (_a = request === null || request === void 0 ? void 0 : request.auth) === null || _a === void 0 ? void 0 : _a.token;
            // Case request from ws
            return token;
        }
    },
    secretOrKey: process.env.JWT_SECRET
    // audience = 'yoursite.net';
}, (jwtPayload, done) => {
    userDao.getOne({ _id: jwtPayload._id })
        .then((user) => {
        done(null, user);
        return true;
    })
        .catch((error) => {
        done(error);
        return false;
    });
}));
/************************************************************************************
 *                              Set Socket.io Config
 ***********************************************************************************/
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
const options = {
    cors: {
        origin: "*", //process.env.CLIENT_URL
        //methods: ['GET', 'POST']
    }
};
exports.io = new socket_io_1.Server(httpServer, options);
exports.io.use((socket, next) => {
    Logger_1.default.debug("socket");
    if (socket.handshake && socket.handshake.auth) {
        Logger_1.default.debug("handshake");
        Logger_1.default.debug(JSON.stringify(socket.handshake));
        socket.request.auth = socket.handshake.auth;
    }
    else {
        Logger_1.default.debug("handshake failed");
    }
    next();
});
exports.io.use(wrap(passport_1.default.initialize()));
exports.io.use(wrap(passport_1.default.authenticate('jwt', { session: false })));
exports.io.use((socket, next) => {
    if (socket.request.user) {
        Logger_1.default.info(socket.request.user);
        next();
    }
    else {
        Logger_1.default.error("Unauthorized");
        next(new Error("unauthorized"));
    }
});
exports.io.on("connection", (socket) => {
    const user = socket.request.user;
    const socketId = socket.id;
    Logger_1.default.info(socketId);
    userDao.updateSocketId(user, socketId);
    //Remove socketId on disconnect
    socket.on('disconnect', function (socket) {
        const socketId = socket.id;
        Logger_1.default.debug(`Disconnected : ${socketId}`);
        userDao.updateSocketId(user, "");
    });
});
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(cors_1.default());
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan_1.default('dev'));
}
// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet_1.default());
}
// Add APIs
app.use('/api/auth', routes_1.authRouter);
app.use('/api/connector', routes_1.connectorRouter);
app.all('/api/*', passport_1.default.authenticate('jwt', { session: false }));
app.use('/api', routes_1.default);
// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    Logger_1.default.error(err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});
/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const viewsDir = path_1.default.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: viewsDir });
});
// Export express instance
exports.default = httpServer;
