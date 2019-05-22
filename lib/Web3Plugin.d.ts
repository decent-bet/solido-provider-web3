import { IMethodOrEventCall, EventFilter, ProviderInstance, SolidoProviderType } from '@decent-bet/solido';
import { Web3Settings } from './Web3Settings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
export declare class Web3Plugin extends SolidoProvider implements SolidoContract {
    private web3;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    getProviderType(): SolidoProviderType;
    onReady<T>(settings: T & Web3Settings): void;
    connect(): void;
    setInstanceOptions(settings: ProviderInstance): void;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): any;
    getEvent(name: string): any;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
