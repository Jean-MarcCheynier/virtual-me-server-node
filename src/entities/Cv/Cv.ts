import { ISkill } from "./Skill";
import { IDegree } from './Degree';

export interface ICv {
  skills: ISkill[];
  degrees: IDegree[];
}