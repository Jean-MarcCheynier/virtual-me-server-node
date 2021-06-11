/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { signin, signup } from './Auth';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { dialog } from './Bot';

// Auth route
export const authRouter = Router();
authRouter.post('/signin', signin);
authRouter.post('/signup', signup);

// User-route
const userRouter = Router();
userRouter.get('/', getAllUsers);
userRouter.post('/', addOneUser);
userRouter.put('/', updateOneUser);
userRouter.delete('/:id', deleteOneUser);

// Bot-route
const botRouter = Router();
botRouter.post('/dialog', dialog);

// Export the base-router
const baseRouter = Router();
baseRouter
  .use('/user', userRouter)
  .use('/bot', botRouter);
export default baseRouter;
