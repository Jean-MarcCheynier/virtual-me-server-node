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
exports.deleteCv = exports.updateCv = exports.addCv = exports.getCv = exports.getAllCv = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("@shared/constants");
const CvDao_1 = __importDefault(require("@daos/Cv/CvDao"));
const cvDao = new CvDao_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
/**
 * Get all cvs.
 *
 * @param req
 * @param res
 * @returns
 */
function getAllCv(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cvs = yield cvDao.getAll();
        return res.status(OK).json(cvs);
    });
}
exports.getAllCv = getAllCv;
/**
 * Get all cvs.
 *
 * @param req
 * @param res
 * @returns
 */
function getCv(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const cv = yield cvDao.getOne({ _id: id });
        return res.status(OK).json(cv);
    });
}
exports.getCv = getCv;
/**
 * Add one cv.
 *
 * @param req
 * @param res
 * @returns
 */
function addCv(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cv } = req.body;
        if (!cv) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield cvDao.add(cv);
        return res.status(CREATED).end();
    });
}
exports.addCv = addCv;
/**
 * Update one cv.
 *
 * @param req
 * @param res
 * @returns
 */
function updateCv(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cv } = req.body;
        if (!cv) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        if (!cv._id) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const update = yield cvDao.update(cv._id, cv);
        return res.json(update);
    });
}
exports.updateCv = updateCv;
/**
 * Delete one cv.
 *
 * @param req
 * @param res
 * @returns
 */
function deleteCv(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield cvDao.delete(id);
        return res.status(OK).end();
    });
}
exports.deleteCv = deleteCv;
