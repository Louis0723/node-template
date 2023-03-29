import TelegramBot from 'node-telegram-bot-api';
import { GetConfig } from '../../config/config';
import { parseCommand, runCommnad } from '../../module/command/commnad';
import CallOpenAI from '../../module/openai';

export default async function handleEvent(event: TelegramBot.Message): Promise<{ id: number, text: string } | null> {
    if (event.text == undefined) {
        return null
    }
    let reply: string = ''

    if (event.text === '人工') {
        reply = '請稍等，有請人工為你處理'
        return { id: event.chat.id, text: reply }
    }

    if (event.chat.id !== undefined) {
        const replyText = await CallOpenAI(event.text, event.chat.id)
        const commnad = parseCommand(replyText)

        if (commnad == undefined) {
            reply = replyText
        } else {
            reply = await runCommnad(event.chat.id, commnad)
        }
    } else {
        reply = 'call OpenAI fails'
        return { id: GetConfig().Telegram.Admin, text: reply }
    }

    // return to telegram
    return { id: event.chat.id, text: reply }
}
