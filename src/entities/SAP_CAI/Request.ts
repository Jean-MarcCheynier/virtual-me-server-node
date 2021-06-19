import { IMessage } from './Message';



/**
 * Request send from the server App to SAP CAI API
 */
export interface IRequest {

  message: IMessage<any>;
  conversation_id: string; 
}

export class Request implements IRequest {
  public message: IMessage<any>;
  public conversation_id: string;
  
  constructor(message: IMessage<any>, conversation_id: string) {
    this.message = message;
    this.conversation_id = conversation_id;
  }
}