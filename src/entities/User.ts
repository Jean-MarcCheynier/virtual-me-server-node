import { Role } from "./Role";

export interface IUserSession {
    conversation: {
        conversation_id: string;
    },
    socketId?: string
}

export interface IUser {
    _id?: any;
    name: string;
    email: string;
    role: Role;
    login: string;
    password?: string;
    session?: IUserSession;
}

class User implements IUser {

    public _id?: string;
    public name: string;
    public email: string;
    public role: Role;
    public login: string;

    constructor(
        nameOrUser: string | IUser,
        role = Role.USER,
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
