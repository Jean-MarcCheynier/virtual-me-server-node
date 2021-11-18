"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
const Skill_1 = require("./Skill");
const Degree_1 = require("./Degree");
const Info_1 = require("./Info");
const Experience_1 = require("./Experience");
exports.schema = new mongoose_1.Schema({
    infos: Info_1.InfoSchema,
    skills: [Skill_1.SkillSchema],
    degrees: [Degree_1.DegreeSchema],
    experiences: [Experience_1.ExperienceSchema]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.default = mongoose_1.model('Cv', exports.schema);
