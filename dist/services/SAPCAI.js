"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAPCAI = void 0;
const virtual_me_ts_core_1 = require("@virtual-me/virtual-me-ts-core");
const Logger_1 = __importDefault(require("@shared/Logger"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const TokenDao_1 = __importDefault(require("../daos/Token/TokenDao"));
class SAPCAI {
    static getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const SAP_CAI_OAUTH_URL = process.env.SAP_CAI_OAUTH_URL || '/SAP_CAI_OAUTH_URL';
            const data = {
                "grant_type": process.env.GRANT_TYPE,
                "client_id": process.env.CLIENT_ID,
                "client_secret": process.env.CLIENT_SECRET
            };
            return axios_1.default({
                method: 'post',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs_1.default.stringify(data),
                url: SAP_CAI_OAUTH_URL
            })
                .then(r => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                Logger_1.default.info("Received SAP CAI API token");
                const tokenDao = new TokenDao_1.default();
                tokenDao.setToken(r.data);
            })
                .catch((e) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                Logger_1.default.error(e);
            });
        });
    }
    static dialog(message, conversation_id, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogPayload = {
                message,
                conversation_id,
            };
            if (language) {
                dialogPayload.language = language;
            }
            const tokenDao = new TokenDao_1.default();
            const access = yield tokenDao.getToken();
            if (access) {
                const { token_type, access_token } = access;
                return axios_1.default.request({
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                        'X-token': process.env.XTOKEN
                    },
                    data: dialogPayload,
                    url: process.env.DIALOG_URL,
                })
                    .then((r) => {
                    const messages = r.data.results.messages.map(message => {
                        message.from = { type: virtual_me_ts_core_1.RecipientType.BOT };
                        return message;
                    });
                    return messages;
                })
                    .catch(e => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    Logger_1.default.error(e);
                    const errorMessage = new virtual_me_ts_core_1.TextMessage("Unable to access the bot");
                    return [errorMessage];
                });
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                Logger_1.default.error("No bot access token present in DB");
                const errorMessage = new virtual_me_ts_core_1.TextMessage("Unable to access the bot");
                return [errorMessage];
            }
        });
    }
}
exports.SAPCAI = SAPCAI;
