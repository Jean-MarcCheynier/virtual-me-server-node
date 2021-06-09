import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';



const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 *  all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export function dialog(req: Request, res: Response) {
  return res.status(OK).end();
}