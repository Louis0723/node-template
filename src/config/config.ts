function GetDefualtConfig() {
    return {
        PublicURL: process.env.PUBLIC_URL || 'http://localhost:3000',
        Openai: {
            Model: {
                ModelVersion: process.env.OPENAI_MODEL_VERSION || "gpt-3.5-turbo",
                MaxTokens: Number(process.env.OPENAI_MAX_TOKEN) || 2000,
                Temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2
            },
            OPENAI_API_KEY: process.env.OPENAI_API_KEY
        },
        Line: {
            Admin: process.env.LINE_ADMIN || '',
            CustomerService: process.env.LINE_CUNSTOMER_SERVICE || process.env.LINE_ADMIN || '',
            ChannelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
            ChannelSecret: process.env.LINE_CHANNEL_SECRET,
        },
        Discord: {
            Admin: Number(process.env.DISCORD_ADMIN || ''),
            CustomerService: Number(process.env.DISCORD_CUNSTOMER_SERVICE || process.env.DISCORD_ADMIN || ''),
            AccessToken: process.env.DISCORD_ACCESS_TOKEN || '',
        },
        Telegram: {
            Admin: Number(process.env.TELEGRAM_ADMIN || ''),
            CustomerService: Number(process.env.TELEGRAM_CUNSTOMER_SERVICE || process.env.TELEGRAM_ADMIN || ''),
            AccessToken: process.env.TELEGRAM_ACCESS_TOKEN || '',
        },
        Ethereum: {
            RpcEndpoint: process.env.ETHEREUM_RPC_ENDPOINT || 'https://goerli.infura.io/v3/'
        }
    }
}
function GetConfig() {
    return GetDefualtConfig()
}
export {
    GetConfig,
    GetDefualtConfig
}

