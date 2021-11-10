/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IDegree } from '@virtual-me/virtual-me-ts-core';



export interface IDegreeDocument extends IDegree, Document{}

export const DegreeSchema = new Schema<IDegreeDocument>({
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
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


export default model<IDegreeDocument>('Degree', DegreeSchema);
