// eslint-disable-next-line spaced-comment
import Web3 from 'web3'
import { IMethodOrEventCall, EventFilter, ThorifyLog, SolidoProviderType } from '@decent-bet/solido';
import { Web3Signer } from './Web3Signer';
import { Web3Settings } from './Web3Settings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
import { SolidoTopic } from '@decent-bet/solido';
/**
 * Web3Plugin provider for Solido
 */
export class Web3Plugin extends SolidoProvider implements SolidoContract {
    private web3: Web3;
    public network: string;
    private instance: any;
    public defaultAccount: string;
    public address: string;
    private privateKey: string;
    
    public getProviderType(): SolidoProviderType {
        return SolidoProviderType.Web3
    }

    onReady<T>(settings: T & Web3Settings) {
        const { privateKey, web3, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.web3 = web3;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.instance = new web3.eth.Contract(
            this.contractImport.raw.abi as any,
            this.contractImport.address[network]
        )
        this.address = this.contractImport.address[network];
        this.web3.eth.accounts.wallet.add(privateKey);
    }

    async prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]):  Promise<SolidoSigner> {
        let gas = options.gas;
        
        if (!options.gas) gas = 1000000

        // get method instance with args
        const fn = methodCall(...args);

        return new Web3Signer(this.web3, fn, this.defaultAccount, {
            gas,
        });
    }
  
      
    getAbiMethod(name: string): object {
        return this.abi.filter(i => i.name === name)[0];
    }
    
    callMethod(name: string, args: any[]): any {
        let addr;
        addr = this.contractImport.address[this.network];
        return this.instance.methods[name](...args).call({
            from: addr
        })
    }
    /**
     * Gets a Web3 Method object
     * @param name method name
     */
    getMethod(
        name: string,
    ): any {
        return this.instance.methods[name];        
    }

    /**
     * Gets a Connex Event object
     * @param address contract address
     * @param eventAbi event ABI
     */
    getEvent(
        name: string,
    ): any {
        return this.instance.events[name];
    }

    public async getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]> {
        const options: any = {};
        if(eventFilter) {
            const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
            if(filter) {
                options.filter = filter;
            }

            if(blocks) {
                const { fromBlock, toBlock } = blocks
                options.toBlock = toBlock;
                options.fromBlock = fromBlock;
            }

            if(range) {
                options.range = range
            }

            if(topics) {
                options.topics = (topics as SolidoTopic).get()
            }
      
            options.order = order || 'desc';
            
            if (pageOptions) {
                options.options = pageOptions
            }
        }

        return await this.instance.getPastEvents(name, options);
    }
}
