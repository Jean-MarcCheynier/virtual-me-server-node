/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';

export interface IInfoDocument extends Document {
  name: string;
  surname: string;
  dateOfBirth: string;
  nationality: string;
  nationalityLOCCODE: string;
  contact: any;
  address: any;  
}



export const InfoSchema = new Schema<IInfoDocument>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  nationalityLOCCODE: { type: String },
  contact: {
    email: String,
    phone: [{
      countryCode: String,
      name: String,
      number: String
    }]
    
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
  picture: String
  
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });


export default model<IInfoDocument>('Info', InfoSchema);
