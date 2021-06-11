import { IMessage } from './Message';

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