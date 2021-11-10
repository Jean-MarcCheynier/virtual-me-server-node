import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { paramMissingError } from '@shared/constants';
import CvDao from '@daos/Cv/CvDao';

const cvDao = new CvDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all cvs.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getAllCv(req: Request, res: Response) {
  const cvs = await cvDao.getAll();
  return res.status(OK).json(cvs);
}

/**
 * Get all cvs.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function getCv(req: Request, res: Response) {
  const id = req.params.id
  const cv = await cvDao.getOne({_id: id});
  return res.status(OK).json(cv);
}

/**
 * Add one cv.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function addCv(req: Request, res: Response) {
  const { cv } = req.body;
  if (!cv) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await cvDao.add(cv);
  return res.status(CREATED).end();
}

/**
 * Update one cv.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function updateCv(req: Request, res: Response) {
  const { cv } = req.body;

  if (!cv) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  
  if (!cv._id) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  
  const update  = await cvDao.update(cv._id, cv);
  return res.json(update);
}

/**
 * Delete one cv.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function deleteCv(req: Request, res: Response) {
  const { id } = req.params;
  await cvDao.delete(id);
  return res.status(OK).end();
}
