import * as ethers from 'ethers'
import { Wallet } from './modle'
// import { GetConfig } from '../../config/config'



const provider = new ethers.InfuraProvider('goerli')
function generatePrivateKey(): ethers.HDNodeWallet {
    // const wallet = ethers.Wallet.createRandom()
    const wallet = ethers.HDNodeWallet.fromSeed('0x12c4792aca392c61260c74e05abd4e889b2cdc882fd599ed2216ef20b61bfa5c')
    wallet.connect(provider)
    return wallet
}

function queryBalance(wallet: ethers.HDNodeWallet): Promise<Wallet> {
    return provider.getBalance(wallet.address).then(balance => {
        return { address: wallet.address, balance: ethers.formatEther(balance.toString()).toString() }
    })
}

async function send(wallet: ethers.HDNodeWallet, toAddress: string, amount: string): Promise<Wallet> {
    const feeData = await provider.getFeeData()
    const nonce = await provider.getTransactionCount(wallet.address)
    const tx: ethers.ethers.TransactionRequest = {
        type: 2,
        from: wallet.address,
        to: toAddress,
        value: ethers.parseEther(amount),
        nonce: nonce,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas
    }

    const gasLimit = await provider.estimateGas(tx)
    tx.gasLimit = gasLimit

    return wallet.sendTransaction(tx).then(txInfo => {
        return {
            address: wallet.address,
            lastTx: txInfo.hash,
        }
    })
}




export {
    Wallet,
    generatePrivateKey,
    queryBalance,
    send,
}
export default {
    generatePrivateKey,
    queryBalance,
    send,
}
