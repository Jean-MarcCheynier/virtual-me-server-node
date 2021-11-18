/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IInfo } from '@virtual-me/virtual-me-ts-core'
import { IContact, ContactType } from '@virtual-me/virtual-me-ts-core/lib/Cv/Contact';
export interface IInfoDocument extends IInfo, Document {}

export interface IContactDocument extends IContact, Document {}

const ContactPhoneSchema = new Schema<IInfoDocument>({
  type: { type: ContactType, default: ContactType.PHONE },
  name: {
    translation: { type: Map, of: String },
  },
  countryCode: String,
  number: String
})

const ContactPostSchema = new Schema<IInfoDocument>({
  type: { type: ContactType, default: ContactType.POST },
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
})

const ContactEmailSchema = new Schema<IInfoDocument>({
  type: { type: ContactType, default: ContactType.EMAIL },
  name: {
    translation: { type: Map, of: String },
  },
  email: String,
})

const ContactSocialNetworkSchema = new Schema<IInfoDocument>({
  type: { type: ContactType, default: ContactType.SOCIAL_NETWORK },
  name: {
    translation: { type: Map, of: String },
  },
  profile: String,
})

export const InfoSchema = new Schema<IInfoDocument>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  dateOfBirth: { type: Date },
  citizenship: {
    translation: { type: Schema.Types.Mixed }
  },
  citizenshipLOCCODE: { type: String },
  contact: [Schema.Types.Mixed],
  picture: String
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


export default model<IInfoDocument>('Info', InfoSchema);
