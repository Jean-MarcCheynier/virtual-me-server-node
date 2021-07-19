import Cv, { ICvDocument } from '../../schemas/Cv/Cv';
import { ICv } from '../../entities/Cv/Cv';



export interface ICvDao {
  getOne: (query: any) => Promise<ICvDocument | null>;
  getAll: () => Promise<ICvDocument[]>;
  add: (cv: ICv) => Promise<ICvDocument | null>;
  update: (id: string, query: any) => Promise<any | null>;
  delete: (id: string) => Promise<any>;
}

class CvDao implements ICvDao {

  /**
   * @param email
   */
  public getOne(query: any): Promise<ICvDocument | null> {
    return Cv.findOne(query).exec()
  }


  /**
   *
   */
  public getAll(): Promise<ICvDocument[]> {
    return Cv.find().exec()
  }


  /**
   *
   * @param user
   */
  public add(cv: ICv): Promise<ICvDocument | null> {
    const newUser = new Cv(cv)

    return newUser.save()
  }


  /**
   *
   * @param user
   */
  public update(id: any , query: any): Promise<any | null> {
    return Cv.updateOne({ _id: id }, query ).exec()
  }


  /**
   *
   * @param id
   */
  public async delete(id: any): Promise<any> {
    return Cv.deleteOne({ _id: id }).exec()
  }
}

export default CvDao;
