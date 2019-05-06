import { SolidoSigner } from '@decent-bet/solido';
export declare class Web3Signer implements SolidoSigner {
    private web3;
    private fn;
    private from;
    gas: number;
    constructor(web3: any, fn: any, from: any, options: any);
    requestSigning(): Promise<any>;
}
