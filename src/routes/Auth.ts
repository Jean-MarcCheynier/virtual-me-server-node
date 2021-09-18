import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import UserDao from '@daos/User/UserDao';
import UserSchema, { IUserDocument } from '../schemas/User'
import logger from '@shared/Logger';
import { IUser, Role } from '@virtual-me/virtual-me-ts-core';




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
        if (!user.session || !user.session.conversation) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const conversation_id: string = uuidv4()
          user.session = { ...user.session, conversation: { conversation_id: conversation_id } }
          user.save();
        }
        const JWTSecret: string = process.env.JWT_SECRET || 'oh-my'
        const token = jwt.sign(user.toObject(), JWTSecret, { expiresIn: '10d' })
        const loggedIn: any = user.toJSON()
        loggedIn.jwt = token
        loggedIn.signedIn = new Date()
        return res.status(OK).json(loggedIn);
      })
      .catch(() => {
        logger.error('login failed')
        return res.status(UNAUTHORIZED).end();
      })
  } else {
    return res.status(UNAUTHORIZED).end();
  }
}


/**
 * signup
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function signup(req: Request, res: Response) {

  const { login, password, email } = req.body;
  const newUser: IUser = {
    name: login,
    email: email,
    role: Role.USER,
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