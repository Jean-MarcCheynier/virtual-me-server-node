"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillSchema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
const virtual_me_ts_core_1 = require("@virtual-me/virtual-me-ts-core");
exports.SkillSchema = new mongoose_1.Schema({
    name: String,
    logo: String,
    level: { type: virtual_me_ts_core_1.LevelEnum },
    type: { type: String, enum: virtual_me_ts_core_1.SkillType },
    translation: { type: Map, of: String },
});
exports.default = mongoose_1.model('Skill', exports.SkillSchema);
