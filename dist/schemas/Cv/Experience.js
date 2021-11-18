"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceSchema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
exports.ExperienceSchema = new mongoose_1.Schema({
    title: {
        translation: { type: Map, of: String },
    },
    description: {
        translation: { type: Map, of: String },
    },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    company: {
        logo: { type: String },
        link: { type: String },
        name: { type: String },
        type: { type: String },
        description: {
            translation: { type: mongoose_1.Schema.Types.Mixed }
        },
    },
    address: {
        line1: String,
        line2: String,
        zipCode: String,
        city: String,
        cityCode: String,
        country: String,
        countryCode: String
    },
    skills: [mongoose_1.Schema.Types.ObjectId]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.default = mongoose_1.model('Experience', exports.ExperienceSchema);
