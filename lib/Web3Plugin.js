"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const solido_1 = require("@decent-bet/solido");
const Web3Signer_1 = require("./Web3Signer");
const solido_2 = require("@decent-bet/solido");
class Web3Plugin extends solido_2.SolidoProvider {
    getProviderType() {
        return solido_1.SolidoProviderType.Web3;
    }
    onReady(settings) {
        const { privateKey, web3, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.web3 = web3;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.connect();
    }
    connect() {
        if (this.web3 && this.network && this.defaultAccount) {
            this.instance = new this.web3.eth.Contract(this.contractImport.raw.abi, this.contractImport.address[this.network]);
            this.address = this.contractImport.address[this.network];
            if (this.privateKey) {
                this.web3.eth.accounts.wallet.add(this.privateKey);
            }
        }
        else {
            throw new Error('Missing onReady settings');
        }
    }
    setInstanceOptions(settings) {
        this.web3 = settings.provider;
        if (settings.options.network) {
            this.network = settings.options.network;
        }
        if (settings.options.defaultAccount) {
            this.defaultAccount = settings.options.defaultAccount;
        }
        if (settings.options.privateKey) {
            this.privateKey = settings.options.privateKey;
        }
    }
    prepareSigning(methodCall, options, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let gas = options.gas;
            if (!options.gas)
                gas = 1000000;
            const fn = methodCall(...args);
            return new Web3Signer_1.Web3Signer(this.web3, fn, this.defaultAccount, {
                gas
            });
        });
    }
    getAbiMethod(name) {
        return this.abi.filter(i => i.name === name)[0];
    }
    callMethod(name, args) {
        let addr;
        addr = this.contractImport.address[this.network];
        return this.instance.methods[name](...args).call({
            from: addr
        });
    }
    getMethod(name) {
        return this.instance.methods[name];
    }
    getEvent(name) {
        return this.instance.events[name];
    }
    getEvents(name, eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {};
            if (eventFilter) {
                const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
                if (filter) {
                    options.filter = filter;
                }
                if (blocks) {
                    const { fromBlock, toBlock } = blocks;
                    options.toBlock = toBlock;
                    options.fromBlock = fromBlock;
                }
                if (range) {
                    options.range = range;
                }
                if (topics) {
                    options.topics = topics.get();
                }
                options.order = order || 'desc';
                if (pageOptions) {
                    options.options = pageOptions;
                }
            }
            return yield this.instance.getPastEvents(name, options);
        });
    }
}
exports.Web3Plugin = Web3Plugin;
