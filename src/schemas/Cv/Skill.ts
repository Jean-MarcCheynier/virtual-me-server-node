/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { ISkill } from '@entities/Cv/Skill';
import { LevelEnum } from '@entities/Cv/Level';
import { SkillType } from '@entities/Cv/Skill';



export interface ISkillDocument extends ISkill, Document { }

export const SkillSchema = new Schema<ISkillDocument>({

  name: String,
  level: { type: LevelEnum },
  type: { type: String, enum: SkillType },
  translation: { type: Map, of: String },
  I18N: String
})


export default model<ISkillDocument>('Degree', SkillSchema);
