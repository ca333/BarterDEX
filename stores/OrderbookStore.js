import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

export default class OrderbookStore {

     @observable asks = [];
     @observable bids = [];


    constructor() {
        const self = this;
        ipcRenderer.on('orderbook', (e, data) => { self.updateOrderbook(data) });
    }

    updateOrderbook = ({ data }) => {
        const asks = data.asks.filter((ask) => ask.numutxos > 0);
        const bids = data.bids.filter((bid) => bid.numutxos > 0);
        this.asks.replace(asks);
        this.bids.replace(bids);
    }

    listenOrderbook = ({ base, rel }) => {
        this.listener = setInterval(() => ipcRenderer.send('orderbook', { base, rel }), 4000);
    }

    killListener = () => {
        // reset orderbook and stop watching
        this.asks.replace([]);
        this.bids.replace([]);
        this.listener && clearInterval(this.listener);
    }

}
