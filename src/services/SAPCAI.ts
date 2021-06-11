import { IMessage, TextMessage } from '@entities/SAP_CAI/Message';
import { Request } from '@entities/SAP_CAI/Request';
import { IResponse } from '@entities/SAP_CAI/Response';
import logger from '@shared/Logger';
import axios from 'axios'
import qs from 'qs';
import TokenDao from '../daos/Token/TokenDao';


axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

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
        const tokenDao = new TokenDao();
        tokenDao.setToken(r.data)  
    })
    .catch(e => {
      logger.err(e)
    })
  }
  
  static async dialog(message: string, conversation_id: string): Promise<IMessage<any>[]> {
    const textMessage = new TextMessage(message);
    const request = new Request(textMessage, conversation_id);
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
        logger.info("Youhou")
        const response: IResponse = r.data;
        return response.results.messages
      })
      .catch(e => {
        logger.err(e);
        const errorMessage: IMessage<string> = new TextMessage("Unable to access the bot");
        return [errorMessage]
      })
    } else {
      logger.err("No bot access token present in DB")
      const errorMessage: IMessage<string> = new TextMessage("Unable to access the bot");
      return [errorMessage]
    }

  }
}