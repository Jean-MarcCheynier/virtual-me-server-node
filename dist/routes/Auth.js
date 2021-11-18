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
exports.signup = exports.signin = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserDao_1 = __importDefault(require("@daos/User/UserDao"));
const User_1 = __importDefault(require("../schemas/User"));
const Logger_1 = __importDefault(require("@shared/Logger"));
const virtual_me_ts_core_1 = require("@virtual-me/virtual-me-ts-core");
const userDao = new UserDao_1.default();
const { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } = http_status_codes_1.default;
/**
 * signin
 *
 * @param req
 * @param res
 * @returns
 */
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = req.body;
        const user = yield User_1.default.findOne({
            $or: [
                { login: login },
                { email: login }
            ]
        });
        if (user !== null) {
            user.comparePassword(password)
                .then((user) => {
                if (!user.session || !user.session.conversation) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    const conversation_id = uuid_1.v4();
                    user.session = Object.assign(Object.assign({}, user.session), { conversation: { conversation_id: conversation_id } });
                    user.save();
                }
                const JWTSecret = process.env.JWT_SECRET || 'oh-my';
                const token = jsonwebtoken_1.default.sign(user.toObject(), JWTSecret, { expiresIn: '10d' });
                const loggedIn = user.toJSON();
                loggedIn.jwt = token;
                loggedIn.signedIn = new Date();
                return res.status(OK).json(loggedIn);
            })
                .catch(() => {
                Logger_1.default.error('login failed');
                return res.status(UNAUTHORIZED).end();
            });
        }
        else {
            return res.status(UNAUTHORIZED).end();
        }
    });
}
exports.signin = signin;
/**
 * signup
 *
 * @param req
 * @param res
 * @returns
 */
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password, email } = req.body;
        const newUser = {
            name: login,
            email: email,
            role: virtual_me_ts_core_1.Role.USER,
            login: login,
            password: password
        };
        const user = yield userDao.add(newUser);
        if (user !== null) {
            return res.status(OK).json(user);
        }
        else {
            return res.status(UNAUTHORIZED).end();
        }
    });
}
exports.signup = signup;
