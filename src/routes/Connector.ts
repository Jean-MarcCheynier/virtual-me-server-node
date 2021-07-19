import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { io } from '@server';
import UserDao, {IUserDao} from '../daos/User/UserDao';
import logger from '@shared/Logger';
import { ActionCode, IActionWebHook } from '@entities/API/webhook';
import { IUser } from '@entities/User';


/**
 *  all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const userDao: IUserDao = new UserDao();

export async function action(req: Request, res: Response) {
  logger.debug('Calling webhook action')
  const action: IActionWebHook = req.body;
  const { actionCode, convId, content } = action;
  
  logger.debug(`Looking for user with convId ${convId}`)
  
  const socketId = await userDao.getOne({ 'session.conversation.conversation_id': convId })
    .then((user: IUser | null) => {
      logger.debug(JSON.stringify(user))
      return user?.session?.socketId;
    })
    .catch((e: Error) => {
      logger.error('Could not find user by conversation_id')
    })

  
  switch (actionCode) {
    case ActionCode.CHANGE_COLOR:
      if (socketId) {
        logger.debug(`Sending ${ActionCode.CHANGE_COLOR}`)
        io.to(socketId).emit(ActionCode.CHANGE_COLOR, content);
      }
      res.json({ "replies": [] })
      break;
    default:
      break
  }
}