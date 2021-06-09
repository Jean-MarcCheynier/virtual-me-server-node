import { Role } from "./Role";
import { ISapCaiSession } from './SAP_CAI/Session';

export interface IUser {
    _id?: any;
    name: string;
    email: string;
    role: Role;
    login: string;
    password?: string;
    session?: ISapCaiSession;
}

class User implements IUser {

    public _id?: string;
    public name: string;
    public email: string;
    public role: Role;
    public login: string;

    constructor(
        nameOrUser: string | IUser,
        role = Role.user,
        login: string,
        password: string,
        email?: string

    ) {
        this.login = login;
        this.role = role;
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.email = email || '';
        } else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
        }
    }
}

export default User;
