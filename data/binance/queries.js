
class Queries{
    constructor(binance){
        this.binance = binance
    }

    getCandleVals(conversion, duration, limit){
        return new Promise((resolve, reject) => {
            this.binance.candlesticks(conversion, duration, (error, ticks, symbol) => {
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
            }, {limit: limit});
        })
        
    }
    
    
    getcurrentPrice(conversion){
        return new Promise((resolve, reject)=>{
            this.binance.prices(conversion, (error, ticker) => {
                if(error){
                    reject(error)
                    retrun 
                }
                resolve(ticker[conversion]);
            });
        });
    }

    getTime(){
        return this.binance.futuresTime()
    }
}


module.exports = Queries
