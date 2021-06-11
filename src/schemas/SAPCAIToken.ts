/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { IToken } from '../entities/SAP_CAI/Token';



export interface ITokenDocument extends IToken, Document { }

export const schema = new Schema<ITokenDocument>({
  ref: {type: String, unique: true, default: 'TOKEN'},
  access_token: String,
  token_type: String,
  expires_in: Number,
  scope: String,
  jti: String
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});



export default model<ITokenDocument>('Token', schema);
