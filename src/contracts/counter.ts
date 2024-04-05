import {
    assert,
    ByteString,
    method,
    prop,
    SmartContract,
    hash256,
} from 'scrypt-ts'

export class Counter extends SmartContract {
    // `count` is stateful property
    @prop(true)
    count: bigint

    // this is what users will call from the outside,
    // when creating a new Counter smart contract
    // like `new Counter(BigInt(7));`
    constructor(count: bigint) {
        super(...arguments)
        this.count = count
    }

    @method()
    public incrementOnChain() {
        // Increment counter.
        this.increment()

        // Ensure next output will contain this contracts code with
        // the updated count property.
        // And make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // outputs containing the latest state and an optional change output
        const outputs: ByteString =
            this.buildStateOutput(amount) + this.buildChangeOutput()
        // verify unlocking tx has the same outputs
        assert(this.ctx.hashOutputs == hash256(outputs), 'hashOutputs mismatch')
    }

    @method()
    increment(): void {
        this.count++
    }
}
