"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
exports.schema = new mongoose_1.Schema({
    ref: { type: String, unique: true, default: 'TOKEN' },
    access_token: String,
    token_type: String,
    expires_in: Number,
    scope: String,
    jti: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.default = mongoose_1.model('Token', exports.schema);
