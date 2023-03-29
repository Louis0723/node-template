import { HDNodeWallet } from "ethers"
import getLogger from "../../utils/logger"
import { generatePrivateKey, queryBalance, send } from "../ethereum"

interface Command {
    command: number,
    to?: string,
    amount?: string,
}
function parseCommand(aiCommand: string): Command | undefined {
    if (aiCommand.includes('電腦我命令你，創建錢包')) {
        return { command: 1 }
    }
    if (aiCommand.includes('電腦我命令你，查詢餘額')) {
        return { command: 2 }
    }
    if (aiCommand.includes('電腦我命令你，轉帳')) {
        const transferInfo = aiCommand.substring(aiCommand.indexOf('[') + 1, aiCommand.indexOf(']') - 1).split(',')
        return { command: 3, to: transferInfo[0], amount: transferInfo[1] }
    }
    return undefined
}

interface UserWallet {
    [index: number | string]: HDNodeWallet;
}
const userWallet: UserWallet = {}

async function runCommnad(userId: string | number, aiCommand: Command): Promise<string> {
    const logger = getLogger()
    let wallet = userWallet[userId]
    if (wallet == undefined) {
        wallet = generatePrivateKey()
        userWallet[userId] = wallet
        logger.info('private key %s', wallet.privateKey)
    }
    if (aiCommand.command == 1) {
        return `你的錢包地址是 ${wallet.address}`
    }
    if (aiCommand.command == 2) {
        const wallet = userWallet[userId]
        const balance = await queryBalance(wallet)
        if (balance.balance != undefined) {
            return `你的錢包 ${wallet.address} 餘額是 ${balance.balance} ETH`
        }
    }
    if (aiCommand.command == 3) {
        const wallet = userWallet[userId]
        if (aiCommand.to != undefined && aiCommand.amount != undefined) {
            const txinfo = await send(wallet, aiCommand.to, aiCommand.amount)

            return `你的交易ID是 ${txinfo.lastTx}`
        }
    }
    return `不清楚你要做什麼`
}

export {
    runCommnad,
    parseCommand
}
export default {
    runCommnad,
    parseCommand
}