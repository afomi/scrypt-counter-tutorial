import { Counter } from './src/contracts/counter'
import { getDefaultSigner } from './tests/utils/txHelper'
import {
  MethodCallOptions
} from 'scrypt-ts'

async function deploy() {
    await Counter.loadArtifact()

    const count = BigInt(2)
    const instance = new Counter(count)
    // connect to a signer
    await instance.connect(getDefaultSigner())

    // deploy the contract and lock up 42 satoshis in it
    const deployTx = await instance.deploy(42)
    console.log('Counter contract deployed: ', deployTx.id)
}

// deploy()

async function callIncrement(
    txId: string,
    atOutputIndex = 0
): Promise<string> {
    await Counter.loadArtifact()

    // Fetch TX via provider and reconstruct contract instance.
    const signer = getDefaultSigner()
    const tx = await signer.connectedProvider.getTransaction(txId)
    const instance = Counter.fromTx(tx, atOutputIndex)

    await instance.connect(signer)

    const nextInstance = instance.next()
    nextInstance.increment()

    const { tx: callTx } = await instance.methods.incrementOnChain({
        next: {
            instance: nextInstance,
            balance: instance.balance,
        },
    } as MethodCallOptions<Counter>)
    console.log(`Counter incrementOnChain called: ${callTx.id}, the count now is: ${nextInstance.count}`)
    return callTx.id
}

// https://test.whatsonchain.com/tx/ca4c16ee87bf8d273710c4e7808f7c3893bfcdbfe9b3725a4f3c3f06aa8898dc
callIncrement("ca4c16ee87bf8d273710c4e7808f7c3893bfcdbfe9b3725a4f3c3f06aa8898dc")
