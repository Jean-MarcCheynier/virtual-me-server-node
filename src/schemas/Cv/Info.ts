/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IDegree } from '../../entities/Cv/Degree';



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
  name: { type: Date, required: true },
  surname: { type: String, required: true },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  nationalityLOCCODE: { type: String },
  contact: {
    email: String,
    phone: [{
      name: String,
      number: Number
    }]
    
  },
  phoneUrl: String,
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


export default model<IInfoDocument>('Degree', InfoSchema);
