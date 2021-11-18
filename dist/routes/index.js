"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorRouter = exports.authRouter = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const Auth_1 = require("./Auth");
const Users_1 = require("./Users");
const Cv_1 = require("./Cv");
const Bot_1 = require("./Bot");
const Connector_1 = require("./Connector");
// Auth route
exports.authRouter = express_1.Router();
exports.authRouter.post('/signin', Auth_1.signin);
exports.authRouter.post('/signup', Auth_1.signup);
// SAP CAI COnnector Router
exports.connectorRouter = express_1.Router();
exports.connectorRouter.post('/action', Connector_1.action);
exports.connectorRouter.get('/cv', Cv_1.getAllCv);
// User-route
const userRouter = express_1.Router();
userRouter.get('/', Users_1.getAllUsers);
userRouter.get('/me', Users_1.getMe);
userRouter.get('/connected', Users_1.getConnectedUsers);
userRouter.post('/', Users_1.addOneUser);
userRouter.put('/', Users_1.updateOneUser);
userRouter.delete('/:id', Users_1.deleteOneUser);
// Bot-route
const botRouter = express_1.Router();
botRouter.post('/dialog', Bot_1.dialog);
// CV-route
const cvRouter = express_1.Router();
cvRouter.get('/', Cv_1.getAllCv);
cvRouter.get('/:id', Cv_1.getCv);
cvRouter.post('/', Cv_1.addCv);
cvRouter.put('/:id', Cv_1.updateCv);
cvRouter.delete('/:id', Cv_1.deleteCv);
// Export the base-router
const baseRouter = express_1.Router();
baseRouter
    .use('/user', userRouter)
    .use('/bot', botRouter)
    .use('/cv', cvRouter);
exports.default = baseRouter;
