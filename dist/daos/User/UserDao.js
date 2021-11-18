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
const User_1 = __importDefault(require("../../schemas/User"));
class UserDao {
    /**
     * @param email
     */
    getOne(query) {
        return User_1.default.findOne(query).exec();
    }
    /**
     *
     */
    getAll() {
        return User_1.default.find().exec();
    }
    /**
    *
    */
    getConnectedUsers() {
        return User_1.default.find({ 'session.socketId': { "$exists": true, "$ne": "" } }).exec();
    }
    /**
     *
     * @param user
     */
    add(user) {
        const newUser = new User_1.default(user);
        return newUser.save();
    }
    /**
     *
     * @param user
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.updateOne({ _id: user._id }, Object.assign({}, user)).exec();
        });
    }
    /**
    *
    * @param user
    */
    updateSocketId(user, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.updateOne({ _id: user._id }, { $set: { 'session.socketId': socketId } }).exec();
        });
    }
    /**
     *
     * @param id
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.deleteOne({ _id: id }).exec();
        });
    }
}
exports.default = UserDao;
