import fs from 'fs';
import { ChatCompletionRequestMessage } from 'openai';
import path from 'path';



async function readAIDocuemnt(): Promise<string[]> {
    let result = []
    const pathResolve = path.resolve()
    const dir = path.join(pathResolve, '/src/assets/')
    const filesBody: Promise<string>[] = [
        'introduce.md',
        'command.md',
        'warning.md',
        'author.md'
    ].map((file: string) => {
        return new Promise((resolve, reject) => {
            fs.readFile(dir + file, (err, fileBuffer) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(fileBuffer.toString())
                }
            })
        })
    })

    const docuemnt = await Promise.all(filesBody).then(filesBody => {
        return filesBody.join('')
    }).catch((err) => {
        return "can't get system role"
    })

    for (let i = 0; i <= docuemnt.length; i += 1000) {
        result.push(docuemnt.substring(i, i + 1000))
    }
    return result
}

async function getSystemRole(): Promise<ChatCompletionRequestMessage[]> {
    const result: ChatCompletionRequestMessage[] = [
        { role: 'system', content: '你是客服機器人，接下來你會收一切關於你的資訊，資訊會分批給你，資訊以markdown的語法提供給你。請把所有關於你的資訊記下來，以提供給用戶服務' }
    ]
    const document = await readAIDocuemnt()
    document.forEach((text, index) => {
        result.push({ role: 'system', content: `${text}` })
    })

    return result
}

export default getSystemRole