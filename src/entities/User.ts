import { IUser, Role } from '@virtual-me/virtual-me-ts-core'

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
