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
exports.dialog = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const SAPCAI_1 = require("../services/SAPCAI");
const { BAD_REQUEST, CREATED, OK, FORBIDDEN } = http_status_codes_1.default;
/**
 *  all users.
 *
 * @param req
 * @param res
 * @returns
 */
function dialog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, language } = req.body;
        const user = req.user;
        if (user && user.session && user.session.conversation) {
            const { conversation_id } = user.session.conversation;
            const response = yield SAPCAI_1.SAPCAI.dialog(message, conversation_id, language);
            res.status(OK).json(response);
        }
        else {
            res.status(FORBIDDEN).end();
        }
    });
}
exports.dialog = dialog;
