export interface ISapCaiSession {
  token: {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    jti: string
  },
  conversation: {
    conversation_id: number;
  }
}