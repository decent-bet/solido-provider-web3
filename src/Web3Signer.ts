import { SolidoSigner } from '@decent-bet/solido';


export class Web3Signer implements SolidoSigner {
    gas = 0;
    constructor(private web3: any, private fn, private from, options) {
        this.gas = options.gas;
    }
    async requestSigning(): Promise<any> {
        return await this.fn.send({ from: this.from, gas: this.gas });
    }
}