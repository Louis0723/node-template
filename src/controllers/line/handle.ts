import * as line from "@line/bot-sdk";
import { GetConfig } from "../../config/config";
import { parseCommand, runCommnad } from "../../module/command/commnad";
import CallOpenAI from '../../module/openai';


export default function HandleEvent(config: line.Config) {
    const client = new line.Client(config as line.ClientConfig);

    return async function handleEvent(event: line.MessageEvent): Promise<line.MessageAPIResponseBase | null> {
        if (event.message.type != 'text') {
            return null;
        }
        let reply: line.Message = { type: 'text', text: '' }


        if (event.message.text === '人工') {
            reply.text = '請稍等，有請人工為你處理'
            client.pushMessage(GetConfig().Line.CustomerService, reply)
        }

        if (event.source.userId !== undefined) {
            const replyText = await CallOpenAI(event.message.text, event.source.userId)
            const commnad = parseCommand(replyText)

            if (commnad == undefined) {
                reply.text = replyText
            } else {
                reply.text = await runCommnad(event.source.userId, commnad)
            }
        } else {
            reply.text = 'call OpenAI fails'
            client.pushMessage(GetConfig().Line.CustomerService, reply)
            client.pushMessage(GetConfig().Line.Admin, reply)
        }

        // return to line
        return client.replyMessage(event.replyToken, reply);
    }
}