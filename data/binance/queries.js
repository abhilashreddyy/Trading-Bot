
function getCandleVals(binance, networkPair, duration, limit){
    return new Promise((resolve, reject) => {
        binance.candlesticks(networkPair, duration, (error, ticks, symbol) => {
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

module.exports = {
    getCandleVals
}
