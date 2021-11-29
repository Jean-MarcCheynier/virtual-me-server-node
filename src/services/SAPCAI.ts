import {
  IMessage,
  TextMessage,
  IDialogRequest,
  IDialogResponse,
  RecipientType
} from '@virtual-me/virtual-me-ts-core';

import logger from '@shared/Logger';
import axios, { AxiosResponse } from 'axios'
import qs from 'qs';
import TokenDao from '../daos/Token/TokenDao';

export class SAPCAI {

  
  static async getToken():Promise<any> {
    const SAP_CAI_OAUTH_URL: string = process.env.SAP_CAI_OAUTH_URL || '/SAP_CAI_OAUTH_URL'
    const data = {
      "grant_type": process.env.GRANT_TYPE,
      "client_id": process.env.CLIENT_ID,
      "client_secret": process.env.CLIENT_SECRET 
    }
    return axios({
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url: SAP_CAI_OAUTH_URL
    })
      .then(r => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        logger.info("Received SAP CAI API token")
        const tokenDao = new TokenDao();
        tokenDao.setToken(r.data)  
    })
    .catch((e: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      logger.error(e)
    })
  }
  
  static async dialog(
    message: IMessage<any>,
    conversation_id: string,
    language?: string): Promise<IMessage<any>[]> {
    const dialogPayload: IDialogRequest = {
      message,
      conversation_id,
    }
    if (language) {
      dialogPayload.language = language;
    }
    const tokenDao = new TokenDao();
    const access = await tokenDao.getToken();
    if (access) {
      const { token_type, access_token } = access;
      return axios.request<IDialogResponse>({
        method: 'post',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'X-token': process.env.XTOKEN
        },
        data: dialogPayload,
        url: process.env.DIALOG_URL,
      })
      .then((r: AxiosResponse<IDialogResponse>) => {
        const messages: IMessage<any>[] = r.data.results.messages.map(message => {
          message.from = { type: RecipientType.BOT };
          message.lang = r.data.results.conversation.language;
          return message
        });
        return messages;
      })
      .catch(e => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        logger.error(e);
        const errorMessage: IMessage<any>  = new TextMessage("Unable to access the bot");
        return [errorMessage]
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      logger.error("No bot access token present in DB")
      const errorMessage: IMessage<any> = new TextMessage("Unable to access the bot");
      return [errorMessage]
    }

  }
}