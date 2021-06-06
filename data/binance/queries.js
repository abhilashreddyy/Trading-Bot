class Queries {
    constructor(exchange, config) {
        this.exchange = exchange;
        this.algoConfig = config.algoConfig[config.algorithm];
        this.config = config
    }

    async initialFetch() {
        // TODO: Push the candles to db
        await this.getCandles(this.config.conversion, this.algoConfig.data.timeFrame, this.algoConfig.lastNCandles);
    }

    async getCandles(pair, candleSize, noOfCandles) {
        return new Promise((resolve, reject) => {
            this.exchange.candlesticks(pair, candleSize, (error, ticks, symbol) => {
                if(error) {
                    reject(error);
                    return;
                }
                let last_tick = ticks[ticks.length - 1];
                let allTicks = []
                for(let i = 0; i < ticks.length; i++){
                    allTicks.push({
                        "time" : ticks[i][0],
                        "high" : parseFloat(ticks[i][2]),
                        "low" : parseFloat(ticks[i][3]),
                        "open" : parseFloat(ticks[i][1]),
                        "close" : parseFloat(ticks[i][4]),
                        "closeTime" : ticks[i][6]
                    })
                }
                resolve(allTicks);
            }, {limit: noOfCandles});
        })
    }
    
    
    async getPrice(pair) {
        return new Promise((resolve, reject)=>{
            this.exchange.prices(pair, (error, ticker) => {
                if(error){
                    reject(error)
                    retrun 
                }
                resolve(ticker[conversion]);
            });
        });
    }
    
    async getTime() {
        return this.exchange.futuresTime()
    }
}


module.exports = Queries;