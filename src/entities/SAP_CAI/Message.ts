
/**
 * Message send from the server App to SAP CAI API
 */
enum MessageType {
  text='text'
}

export interface IMessage<T> {
  type: MessageType
  content: T
  markdown?: any
  delay?: any
}

export class TextMessage implements IMessage<string> {
  public type: MessageType = MessageType.text;
  public content: string;
  
  constructor(content: string) {
    this.content = content
  }
}