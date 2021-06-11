import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';
import { SAPCAI } from '../services/SAPCAI';
import { IUser } from '@entities/User';



const { BAD_REQUEST, CREATED, OK, FORBIDDEN } = StatusCodes;



/**
 *  all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function dialog(req: Request, res: Response) {
  const { message } = req.body;
  const user: any = req.user;
  if (user && user.session && user.session.conversation) {
    const { conversation_id } = user.session.conversation
    const response = await SAPCAI.dialog(message, conversation_id);
    return res.status(OK).json(response);
  } else {
    return res.status(FORBIDDEN).end();
  }
}