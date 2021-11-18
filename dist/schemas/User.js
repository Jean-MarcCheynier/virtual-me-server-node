"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
const virtual_me_ts_core_1 = require("@virtual-me/virtual-me-ts-core");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    role: { type: virtual_me_ts_core_1.Role, default: virtual_me_ts_core_1.Role.USER, enum: virtual_me_ts_core_1.Role, required: true },
    login: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    session: { type: mongoose_1.Schema.Types.Mixed, required: false }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.schema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew && this.password) {
        bcrypt_1.default.genSalt(10, (err, salt) => {
            if (err) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return next(err);
            }
            const password = this.password || '';
            bcrypt_1.default.hash(password, salt, (err, hash) => {
                if (err) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next();
    }
});
exports.schema.methods.comparePassword = function (pw) {
    return new Promise((resolve, reject) => {
        const password = this.password || '';
        bcrypt_1.default.compare(pw, password, (err, isMatch) => {
            if (err) {
                reject(err);
            }
            if (isMatch) {
                resolve(this);
            }
            else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject("Password don't match");
            }
        });
    });
};
exports.schema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
exports.default = mongoose_1.model('User', exports.schema);
