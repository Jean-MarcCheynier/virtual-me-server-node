import { IMessage } from './Message';


/**
 * Response received by the server App from SAP CAI API
 */
export interface IResponse {
  results: {
    nlp: any,
    messages: IMessage<any>[],
    conversation: {
      id: string,
      language: string,
      memory: any,
      skill: string,
      skill_occurences: number,
      skill_id: string
    },
    logs: any,
    qna: any,
    fallback: any
  },
  message: string
}