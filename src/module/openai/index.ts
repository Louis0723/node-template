import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { GetConfig } from '../../config/config';
import getSystemRole from './system';

// openai key
const openAIKey = GetConfig().Openai.OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: openAIKey })
const openai = new OpenAIApi(configuration);

interface User {
    [index: number | string]: ChatCompletionRequestMessage[];
}

const mapUserHistory: User = {}

async function CallOpenAI(text: string, userId: number | string): Promise<string> {
    if (mapUserHistory[userId] === undefined || mapUserHistory[userId].length > 50) {
        mapUserHistory[userId] = []
    }

    mapUserHistory[userId].push({ role: 'user', content: text })

    const requestMsg = [...await getSystemRole(), ...mapUserHistory[userId]]
    const openaiResponse = await openai.createChatCompletion({
        model: GetConfig().Openai.Model.ModelVersion,
        messages: requestMsg,
        max_tokens: GetConfig().Openai.Model.MaxTokens,
        temperature: GetConfig().Openai.Model.Temperature
    })

    if (openaiResponse.data.choices[0] != null) {
        const message = openaiResponse.data.choices[0].message
        if (message !== undefined) {
            mapUserHistory[userId].push({ role: 'assistant', content: message.content })
            return message.content
        } else {
            return 'OpenAI not return message'
        }
    } else {
        return 'OpenAI no have return'
    }
}
export default CallOpenAI