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
const Cv_1 = __importDefault(require("../../schemas/Cv/Cv"));
class CvDao {
    /**
     * @param email
     */
    getOne(query) {
        return Cv_1.default.findOne(query).exec();
    }
    /**
     *
     */
    getAll() {
        return Cv_1.default.find().exec();
    }
    /**
     *
     * @param user
     */
    add(cv) {
        const newUser = new Cv_1.default(cv);
        return newUser.save();
    }
    /**
     *
     * @param user
     */
    update(id, query) {
        return Cv_1.default.updateOne({ _id: id }, query).exec();
    }
    /**
     *
     * @param id
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Cv_1.default.deleteOne({ _id: id }).exec();
        });
    }
}
exports.default = CvDao;
