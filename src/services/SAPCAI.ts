import { IMessage, Sender, TextMessage, IDialogResponse, DialogResponse } from '@entities/API/bot';
import { Request } from '@entities/SAP_CAI/Request';
import { IResponse } from '@entities/SAP_CAI/Response';
import logger from '@shared/Logger';
import axios from 'axios'
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
        logger.info("Received SAP CAI API token")
        const tokenDao = new TokenDao();
        tokenDao.setToken(r.data)  
    })
    .catch(e => {
      logger.error(e)
    })
  }
  
  static async dialog(message: IMessage<any>, conversation_id: string): Promise<IDialogResponse> {
    const request = new Request(message, conversation_id);
    const tokenDao = new TokenDao();
    const access = await tokenDao.getToken();
    if (access) {
      const { token_type, access_token } = access;
      return axios({
        method: 'post',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'X-token': process.env.XTOKEN
        },
        data: request,
        url: process.env.DIALOG_URL
      })
      .then(r => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const SAPCAIResponse: IResponse = r.data;
        const APIResponse: IDialogResponse = DialogResponse.fromSAPCAI(SAPCAIResponse)
        return APIResponse
      })
      .catch(e => {
        logger.error(e);
        const errorMessage: IMessage<string> = new TextMessage("Unable to access the bot");
        return { messages: [errorMessage] }
      })
    } else {
      logger.error("No bot access token present in DB")
      const errorMessage: IMessage<string> = new TextMessage("Unable to access the bot");
      return { messages: [errorMessage] }
    }

  }
}