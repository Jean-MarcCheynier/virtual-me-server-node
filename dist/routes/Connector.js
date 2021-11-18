"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const _server_1 = require("@server");
const UserDao_1 = __importDefault(require("../daos/User/UserDao"));
const Logger_1 = __importDefault(require("@shared/Logger"));
/**
 *  all users.
 *
 * @param req
 * @param res
 * @returns
 */
const userDao = new UserDao_1.default();
function action(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        Logger_1.default.debug('Calling webhook action');
        const action = req.body;
        const { actionCode, convId, content } = action;
        Logger_1.default.debug(`Looking for user with convId ${convId}`);
        const socketId = yield userDao.getOne({ 'session.conversation.conversation_id': convId })
            .then((user) => {
            var _a;
            Logger_1.default.debug(JSON.stringify(user));
            return (_a = user === null || user === void 0 ? void 0 : user.session) === null || _a === void 0 ? void 0 : _a.socketId;
        })
            .catch((e) => {
            Logger_1.default.error('Could not find user by conversation_id');
        });
        switch (actionCode) {
            default:
                if (socketId) {
                    Logger_1.default.debug(`Sending ${actionCode}`);
                    _server_1.io.to(socketId).emit(actionCode, content);
                }
                res.json({ "replies": [] });
                break;
        }
    });
}
exports.action = action;
