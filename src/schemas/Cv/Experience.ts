/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IExperience } from '@virtual-me/virtual-me-ts-core';

export interface IExperienceDocument extends IExperience, Document { }

export const ExperienceSchema = new Schema<IExperienceDocument>({
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
      translation: { type: Schema.Types.Mixed }
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
  skills: [Schema.Types.ObjectId]
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})


export default model<IExperienceDocument>('Experience', ExperienceSchema);
