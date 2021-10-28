/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { signin, signup } from './Auth';
import {
  getAllUsers, addOneUser,
  updateOneUser, deleteOneUser,
  getMe, getConnectedUsers
} from './Users';
import { getCv, getAllCv, updateCv, deleteCv, addCv } from './Cv';
import { dialog } from './Bot';
import { action } from './Connector';

// Auth route
export const authRouter = Router();
authRouter.post('/signin', signin);
authRouter.post('/signup', signup);

// SAP CAI COnnector Router
export const connectorRouter = Router();
connectorRouter.post('/action', action);
connectorRouter.get('/cv', getAllCv);

// User-route
const userRouter = Router();
userRouter.get('/', getAllUsers);
userRouter.get('/me', getMe);
userRouter.get('/connected', getConnectedUsers);
userRouter.post('/', addOneUser);
userRouter.put('/', updateOneUser);
userRouter.delete('/:id', deleteOneUser);

// Bot-route
const botRouter = Router();
botRouter.post('/dialog', dialog);

// CV-route
const cvRouter = Router();
cvRouter.get('/', getAllCv);
cvRouter.get('/:id', getCv);
cvRouter.post('/', addCv);
cvRouter.put('/:id', updateCv);


// Export the base-router
const baseRouter = Router();
baseRouter
  .use('/user', userRouter)
  .use('/bot', botRouter)
  .use('/cv', cvRouter)

export default baseRouter;
