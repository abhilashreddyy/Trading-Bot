class Queries {
    constructor(exchange, config) {
        this.exchange = exchange;
        this.config = config.algoConfig[config.algorithm];
    }

    async initialFetch() {
        // TODO: Push the candles to db
        await this.getCandles(this.conversion, this.config.data.timeFrame, this.config.lastNCandles);
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
                        "high" : ticks[i][2],
                        "low" : ticks[i][3],
                        "open" : ticks[i][1],
                        "close" : ticks[i][4],
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