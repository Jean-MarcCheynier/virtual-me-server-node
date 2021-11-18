import { IUser } from '@virtual-me/virtual-me-ts-core';
import User from '../../schemas/User'



export interface IDegreeDao  {
  getOne: (query: any) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<IUser | null>;
  update: (user: IUser) => Promise<IUser | null>;
  delete: (id: string) => Promise<any>;
}

class DegreeDao implements IDegreeDao {


  /**
   * @param email
   */
  public getOne(query: any): Promise<IUser | null> {
    return User.findOne(query).exec()
  }


  /**
   *
   */
  public getAll(): Promise<IUser[]> {
    return User.find().exec()
  }


  /**
   *
   * @param user
   */
  public add(user: IUser): Promise<IUser | null> {
    const newUser = new User(user)

    return newUser.save()
  }


  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<any | null> {
    return User.updateOne({ _id: user._id }, { ...user }).exec()
  }


  /**
   *
   * @param id
   */
  public async delete(id: any): Promise<any> {
    return User.deleteOne({ _id: id }).exec()
  }
}

export default DegreeDao;
