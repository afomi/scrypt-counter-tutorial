import { Counter } from './src/contracts/counter'
import { getDefaultSigner } from './tests/utils/txHelper'

async function main() {
    await Counter.loadArtifact()

    const count = BigInt(2)
    const instance = new Counter(count)
    // connect to a signer
    await instance.connect(getDefaultSigner())

    // deploy the contract and lock up 42 satoshis in it
    const deployTx = await instance.deploy(42)
    console.log('Counter contract deployed: ', deployTx.id)
}

main()
