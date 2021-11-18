import { IMessage } from '@virtual-me/virtual-me-ts-core'

export interface IActionWebHook {
  convId: string,
  actionCode: ActionCode,
  content: any
}

export interface IWebHookResponseBody {
  replies: IMessage<any>[],
  conversation: {
    language: string,
    memory: any
  }
}

export enum ActionCode {
  CHANGE_COLOR = 'changeUserColor',
  CHANGE_LANG = 'changeLang',
}