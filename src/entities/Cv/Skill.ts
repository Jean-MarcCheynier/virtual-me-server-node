import { LevelEnum } from "./Level";
import ITranslatable from '../Itranslatable';

export enum SkillType {
  LANGUAGE = "language",
  SOFTWARE = "software",
  METHODOLOGY = "methodology",
  TECHNICAL = "technical",
  PROGRAMMING = "programming",
}

export interface ISkill extends ITranslatable {
  name: string,
  level: LevelEnum,
  type: SkillType
}