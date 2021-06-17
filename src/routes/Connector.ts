import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { io } from '@server';


/**
 *  all users.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export function action(req: Request, res: Response) {
  console.log("CALLED");
  io.emit("test", "coucou");
  return res.json({
    "replies": [
      {
        "type": "text",
        "content": "Hello world!"
      }
    ],
    "conversation": {
      "language": "en",
      "memory": {
        "user": "Bob"
      }
    }
  })
}