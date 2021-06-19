/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IDegree } from '../../entities/Cv/Degree';



export interface IDegreeDocument extends IDegree, Document{}

export const DegreeSchema = new Schema<IDegreeDocument>({
  from: { type: Date, required: true },
  to: { type: String, required: true },
  school: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    translation: Schema.Types.Mixed,
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
