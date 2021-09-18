import { IToken } from '../../entities/SAP_CAI/Token';
import Token from '../../schemas/SAPCAIToken'
import mongoose from 'mongoose'
import logger from '@shared/Logger';



export interface ITokenDao {
  getToken: () => Promise<IToken | null>;
  setToken: (token: IToken) => Promise<any>;
}

const REF = "TOKEN"

class TokenDao implements ITokenDao {
  
  public getToken(): Promise<IToken | null> {
    return Token.findOne({ ref: REF}).exec()
  }
  public setToken(token: IToken): Promise<any> {
    return Token.findOneAndUpdate({ ref: REF }, token,
      {
        upsert: true,
        new: true,
        projection: { _id: 0, __v: 0 }
      }).exec();
  }
}



export default TokenDao;
