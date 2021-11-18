"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSchema = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = require("mongoose");
const Contact_1 = require("@virtual-me/virtual-me-ts-core/lib/Cv/Contact");
const ContactPhoneSchema = new mongoose_1.Schema({
    type: { type: Contact_1.ContactType, default: Contact_1.ContactType.PHONE },
    name: {
        translation: { type: Map, of: String },
    },
    countryCode: String,
    number: String
});
const ContactPostSchema = new mongoose_1.Schema({
    type: { type: Contact_1.ContactType, default: Contact_1.ContactType.POST },
    name: {
        translation: { type: Map, of: String },
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
});
const ContactEmailSchema = new mongoose_1.Schema({
    type: { type: Contact_1.ContactType, default: Contact_1.ContactType.EMAIL },
    name: {
        translation: { type: Map, of: String },
    },
    email: String,
});
const ContactSocialNetworkSchema = new mongoose_1.Schema({
    type: { type: Contact_1.ContactType, default: Contact_1.ContactType.SOCIAL_NETWORK },
    name: {
        translation: { type: Map, of: String },
    },
    profile: String,
});
exports.InfoSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dateOfBirth: { type: Date },
    citizenship: {
        translation: { type: mongoose_1.Schema.Types.Mixed }
    },
    citizenshipLOCCODE: { type: String },
    contact: [mongoose_1.Schema.Types.Mixed],
    picture: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
exports.default = mongoose_1.model('Info', exports.InfoSchema);
