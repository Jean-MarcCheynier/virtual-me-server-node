
import ITranslatable from '../Itranslatable';

export interface IDegree extends ITranslatable{
  from: string;
  to: string;
  school: {
    name: string;
    type: string;
    translation: {
      en: string,
      fr: string
    } 
  }
  adress: {
    line1: string;
    line2: string;
    zipCode: string,
    city: string,
    cityCode: string,
    country: string,
    countryCode: string
  }
}