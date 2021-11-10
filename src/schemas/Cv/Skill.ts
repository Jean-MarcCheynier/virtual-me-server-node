/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Schema, model, Document } from 'mongoose';
import { LevelEnum, SkillType, ISkill }  from '@virtual-me/virtual-me-ts-core';

export interface ISkillDocument extends ISkill, Document { }

export const SkillSchema = new Schema<ISkillDocument>({
  name: String,
  logo: String,
  level: { type: LevelEnum },
  type: { type: String, enum: SkillType },
  translation: { type: Map, of: String },
})


export default model<ISkillDocument>('Skill', SkillSchema);
