"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegreeSchema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
exports.DegreeSchema = new mongoose_1.Schema({
    title: {
        translation: { type: Map, of: String },
    },
    description: {
        translation: { type: Map, of: String },
    },
    date: { type: Date, required: true },
    school: {
        logo: { type: String },
        link: { type: String },
        name: { type: String, required: true },
        type: { type: String, required: true },
        translation: { type: Map, of: String },
        address: {
            line1: String,
            line2: String,
            zipCode: String,
            city: String,
            cityCode: String,
            country: String,
            countryCode: String
        }
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.default = mongoose_1.model('Degree', exports.DegreeSchema);
