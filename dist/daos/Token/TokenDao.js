"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SAPCAIToken_1 = __importDefault(require("../../schemas/SAPCAIToken"));
const REF = "TOKEN";
class TokenDao {
    getToken() {
        return SAPCAIToken_1.default.findOne({ ref: REF }).exec();
    }
    setToken(token) {
        return SAPCAIToken_1.default.findOneAndUpdate({ ref: REF }, token, {
            upsert: true,
            new: true,
            projection: { _id: 0, __v: 0 }
        }).exec();
    }
}
exports.default = TokenDao;
