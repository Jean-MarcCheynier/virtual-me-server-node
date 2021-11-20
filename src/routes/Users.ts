import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';

import UserDao from '@daos/User/UserDao';
import { IUser } from '@virtual-me/virtual-me-ts-core';



const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;



/**
 * Get all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllUsers(req: Request, res: Response) {
    const users = await userDao.getAll();
    return res.status(OK).json({users});
}


/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addOneUser(req: Request, res: Response) {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await userDao.add(user);
    return res.status(CREATED).end();
}


/**
 * Update one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateOneUser(req: Request, res: Response) {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await userDao.update(user);
    return res.status(OK).end();
}


/**
 * Delete one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteOneUser(req: Request, res: Response) {
    const { id } = req.params;
    await userDao.delete(Number(id));
    return res.status(OK).end();
}

/**
 * Get connected user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getMe(req: Request, res: Response) {
    const user: any = req.user
    console.log("Getting user");
    const me = await userDao.getOne({ _id: user._id });
    console.log(user.username);
    return res.json(me);
}


/**
 * Get connected users.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getConnectedUsers(req: Request, res: Response) {
    const connectedUsers: IUser[] = await userDao.getConnectedUsers();
    return res.json(connectedUsers);
}
