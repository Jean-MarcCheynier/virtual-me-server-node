import ITranslatable from '../Itranslatable';

export enum LevelEnum {
  JUNIOR ='JUNIOR',
  MEDIOR ='MEDIOR',
  SENIOR ='SENIOR'
}

export interface ILevel extends ITranslatable {
  type: LevelEnum;
}

export function getLevel(level: LevelEnum) {
  let translatable;
  switch (level) {
    case LevelEnum.JUNIOR:
      translatable = {
        translation: {
          en: 'junior',
          fr: 'debutant'
        },
        I18N: 'const.level.junior'
      }
      break;
    case LevelEnum.MEDIOR:
      translatable = {
        translation: {
          en: 'medior',
          fr: 'intermédiaire'
        },
        I18N: 'const.level.medior'
      }
      break; case LevelEnum.SENIOR:
      translatable = {
        translation: {
          en: 'senior',
          fr: 'expert'
        },
        I18N: 'const.level.senior'
      }
      break;
  }
  return { ...translatable, type: level}
}