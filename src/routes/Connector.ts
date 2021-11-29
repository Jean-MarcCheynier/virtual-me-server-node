import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { io } from '@server';
import UserDao, {IUserDao} from '../daos/User/UserDao';
import logger from '@shared/Logger';
import { ActionCode, IActionWebHook } from '@entities/API/webhook';
import { IUser, TextMessage } from '@virtual-me/virtual-me-ts-core';
import { Socket } from 'socket.io';


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
  
  const user: IUser | void = await userDao.getOne(
    { 'session.conversation.conversation_id': convId })
    .then((user: IUser | null) => {
      //logger.debug(JSON.stringify(user))
      return user as IUser;
    })
    .catch((e: Error) => {
      logger.error('Could not find user by conversation_id')
    })
  
  let socketId = "";
  
  //Get user and socketId from conversationId
  if (user) {
    socketId = user?.session?.socketId || "";
  } else {
    // eslint-disable-next-line max-len
    const errorMsg = new TextMessage("... hmmm there is something wrong with my socket server, sorry")
    return res.json({ "replies": [errorMsg] })
  }
  
  //
  if (!socketId) {
    // eslint-disable-next-line max-len
    const errorMsg = new TextMessage("... hmmm there is something wrong with my socket server, sorry")
    return res.json({ "replies": [errorMsg] })
  }

  
  switch (actionCode) {
    case ActionCode.CHANGE_COLOR:
      logger.info("Changing color in db")
      await userDao.updatePreferredColor(user, content)
      io.to(socketId).emit(actionCode, content);
      break;
    
    case ActionCode.CHANGE_LANG:
      logger.info("Changing lang in db")
      await userDao.updatePreferredLang(user, content)
      io.to(socketId).emit(actionCode, content);
      break;

    default:
      if (socketId && actionCode) {
        logger.debug(`Sending ${actionCode as string}`)
        io.to(socketId).emit(actionCode, content);
      }
      break;
  }
  res.json({ "replies": [] })
}