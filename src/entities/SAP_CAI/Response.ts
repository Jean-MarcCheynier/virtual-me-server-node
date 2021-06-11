import { IMessage } from './Message';

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