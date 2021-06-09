import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';
import jwt from 'jsonwebtoken';

import UserDao from '@daos/User/UserDao';
import UserSchema, { IUserDocument } from '../schemas/User'
import logger from '@shared/Logger';
import { Role } from '@entities/Role';
import { IUser } from '@entities/User';




const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } = StatusCodes;



/**
 * signin
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function signin(req: Request, res: Response) {
  
  const { login, password } = req.body;
  const user: IUserDocument | null = await UserSchema.findOne({
    $or: [
      { login: login },
      { email: login }
    ]
  });

  if (user !== null) {
    user.comparePassword(password)
      .then((user: IUserDocument) => {
        const JWTSecret: string = process.env.JWT_SECRET || 'oh-my'
        const token = jwt.sign(user.toObject(), JWTSecret, { expiresIn: '10d' })
        const loggedIn: any = user.toJSON()
        loggedIn.jwt = token
        loggedIn.signedIn = new Date()
        return res.status(OK).json(loggedIn);
      })
      .catch(() => {
        logger.err('login failed')
        return res.status(UNAUTHORIZED).end();
      })
  } else {
    return res.status(UNAUTHORIZED).end();
  }
}


/**
 * signin
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function signup(req: Request, res: Response) {

  const { login, password } = req.body;
  const newUser: IUser = {
    name: login,
    email: 'defaul@email.com',
    role: Role.user,
    login: login,
    password: password
  }
  const user: IUser | null = await userDao.add(newUser)
  if (user !== null) {
    return res.status(OK).json(user);
  } else {
    return res.status(UNAUTHORIZED).end();
  }
}