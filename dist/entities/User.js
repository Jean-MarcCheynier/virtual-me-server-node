"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_me_ts_core_1 = require("@virtual-me/virtual-me-ts-core");
class User {
    constructor(nameOrUser, role = virtual_me_ts_core_1.Role.USER, login, password, email) {
        this.login = login;
        this.role = role;
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.email = email || '';
        }
        else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
        }
    }
}
exports.default = User;
