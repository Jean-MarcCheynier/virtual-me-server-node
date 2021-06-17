import { IMessage as ISAPCAIMessage, TextMessage as SAPCAITextMessage } from "../SAP_CAI/Message";
import { IResponse } from '../SAP_CAI/Response';

export enum Sender {
  BOT,
  USER
}

export interface IMessage<T> extends ISAPCAIMessage<T> {
  from: Sender
}

export class TextMessage extends SAPCAITextMessage {

  public from: Sender;
  
  constructor(content: string) {
    super(content)
    this.from = Sender.BOT
  }
  
  static fromSAPCAI(SAPCAIMessage: ISAPCAIMessage<string>): TextMessage {
    return new TextMessage(SAPCAIMessage.content)
  }
}

export interface IDialogResponse {
  messages: IMessage<any>[],
}

export class DialogResponse implements IDialogResponse {
  public messages: IMessage<any>[] = []
  
  static fromSAPCAI(SAPCAIResponse: IResponse): IDialogResponse {
    const messages: IMessage<any>[] = SAPCAIResponse.results.messages
      .map((message: ISAPCAIMessage<any>) => {
        return TextMessage.fromSAPCAI(message)
      })
    return { messages: messages}
  }
  
}