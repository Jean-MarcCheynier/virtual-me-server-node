import { IUser } from '@virtual-me/virtual-me-ts-core';
import { randomPassword, upper, lower, digits } from 'secure-random-password'
import User from '../../schemas/User'



export interface IUserDao {
    getOne: (query: any) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    signinWithGithub: (githubProfile: any) => Promise<IUser>;
    add: (user: IUser) => Promise<IUser | null>;
    update: (user: IUser) => Promise<IUser | null>;
    updateSocketId: (user: IUser, socketId: string) => Promise<IUser | null>;
    updatePreferredLang: (user: IUser, lang: string) => Promise<IUser | null>;
    updatePreferredColor: (user: IUser, color: string) => Promise<IUser | null>;
    delete: (id: string) => Promise<any>;
}

class UserDao implements IUserDao {

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
    */
    public getConnectedUsers(): Promise<IUser[]> {
        return User.find({ 'session.socketId': { "$exists": true, "$ne": "" }}).exec()
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
    * @param user
    */
    public async updateSocketId(user: IUser, socketId: string): Promise<any | null> {
        return User.updateOne({ _id: user._id }, { $set: { 'session.socketId': socketId } }).exec()
    }
    
    /**
    *
    * @param user
    */
    public async updatePreferredLang(user: IUser, lang: string): Promise<any | null> {
        return User.updateOne({ _id: user._id }, { $set: { 'session.lang': lang } }).exec()
    }
    
    /**
    *
    * @param user
    */
    public async updatePreferredColor(user: IUser, color: string): Promise<any | null> {
        return User.updateOne({ _id: user._id }, { $set: { 'session.color': color } }).exec()
    }
    
    
    /**
    * Takes a github profile and create/find the associated user in virtual-me' database.
    * @param githubProfile
    * @return valid jwt token for the user
    */
    public async signinWithGithub(githubProfile: any): Promise<any | null> {
        const { id, displayName, username, profileUrl, photos, provider } = githubProfile;
        const user = await User.findOne({ "profile.github.id": id})
            .then((r) => {
                if (r) {
                    return r 
                } else {
                    //Generate arbitrary password : 
                    const password: string = randomPassword({
                        characters: [lower, upper, digits]
                    })
                    const newUser = new User({
                        name: username,
                        login: username,
                        password: password,
                        profile: {
                            github: {
                                id,
                                displayName,
                                username,
                                profileUrl,
                                photos,
                                provider
                            }
                        }
                    });
                    newUser.save();
                    return newUser
                }

            })
            .catch(e => {
                return false
            })
        return user;

    }
    
    /**
     *
     * @param id
     */
    public async delete(id: any): Promise<any> {
        return User.deleteOne({_id: id}).exec()
    }
}

export default UserDao;
