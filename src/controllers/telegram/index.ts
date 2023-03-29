import express from "express";
import TelegramBot from 'node-telegram-bot-api';
import { GetConfig } from '../../config/config';
import getLogger from "../../utils/logger";
import HandleEvent from "./handle";

const logger = getLogger()
function AddTelegramRoute(): express.Router {
    logger.info('AddTelegramRoute')
    const telegramRoute = express.Router()

    const telegramOption: TelegramBot.ConstructorOptions = { polling: false, filepath: false }
    const bot = new TelegramBot(GetConfig().Telegram.AccessToken, telegramOption)

    if (telegramOption.polling === false) {
        bot.setWebHook(GetConfig().PublicURL + '/webhook');
        bot.openWebHook().catch(logger.info)
        bot.on('webhook_error', (error) => {
            logger.error(error.message);
        });

        // webhook
        telegramRoute.post('/webhook', express.json(), async (req, res) => {
            if (req.body.message != undefined) {
                const msg: TelegramBot.Message = req.body.message
                logger.info('telegram msg', msg)

                const reply = await HandleEvent(msg)
                if (reply !== null) {
                    bot.sendMessage(reply.id, reply.text)
                }
                res.send('OK').end()
            } else {
                res.status(500).end()
            }
        })
    } else if (telegramOption.polling === true) {
        bot.on('polling_error', (error) => {
            logger.info(error.message);
        });

        // messages
        bot.on('message', async (msg) => {
            logger.info(msg)
            const reply = await HandleEvent(msg)
            if (reply !== null) {
                bot.sendMessage(reply.id, reply.text)
            }
        });
    }

    return telegramRoute
}
export default AddTelegramRoute