/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { SkillSchema, ISkillDocument } from './Skill';
import { DegreeSchema, IDegreeDocument } from './Degree';
import { InfoSchema } from './Info';
import { IInfoDocument } from './Info';

export interface ICvDocument extends Document {
  infos: IInfoDocument;
  skills: ISkillDocument[];
  degrees: IDegreeDocument[];
}

export const schema = new Schema<ICvDocument>({
  infos: InfoSchema,
  skills: [SkillSchema],
  degrees: [DegreeSchema]
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });


export default model<ICvDocument>('Cv', schema);
