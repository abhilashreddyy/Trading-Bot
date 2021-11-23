const utils = require("../../utils")


class Queries {
    constructor(exchange, mysqlOps, config) {
        this.exchange = exchange;
        this.algoConfig = config.algoConfig[config.algorithm];
        this.config = config
        this.mysqlOps = mysqlOps
    }

    async initialFetch() {
        // TODO: Push the candles to db
        await this.getCandles(this.config.conversion, this.algoConfig.data.timeFrame, this.algoConfig.lastNCandles);
    }

    async getCandles(pair, candleSize, noOfCandles){
        var timeStampsRange = utils.lib.time.getUnixTimestampsRange(this.config.exchange, candleSize, noOfCandles)
        var UnavailableTimeRanges = await this.mysqlOps.candlesTable.getUnavailableTimeRanges(timeStampsRange)
        var i = 0
        while(i < UnavailableTimeRanges.length){
            try{
                // console.log("query un avail range : ", UnavailableTimeRanges[i])
                var candles = await this.getCandlesfromApi(pair, candleSize, 0, UnavailableTimeRanges[i][0], UnavailableTimeRanges[i][1])
                // var candles = await this.getCandlesfromApi(pair, candleSize, 0, 1619323200000,1619340300000)


                // process.exit(1)
                for(var n = 0; n < candles.length; n++){
                    await this.mysqlOps.candlesTable.addRow(candles[n])
                }
                i+=1
                
                await setTimeout(()=>{
                    // console.log("just waiting")
                },300)
            }
            catch(error){
                // console.log("error : ",error)
                // process.exit(1)
                await setTimeout(()=>{
                    // console.log("just waiting")
                },300)
                i+=1
            }
        }
        var allTicks = []
        // console.log("befire ; ", timeStampsRange)
        var ticks = await this.mysqlOps.candlesTable.getDatabaserange(timeStampsRange)
        var readableTime = new Date(ticks[i].time)

        for(let i = 0; i < ticks.length; i++){
            allTicks.push({
                "time" : ticks[i].time,
                "readableTime" : utils.lib.time.getReadableLocalTime(ticks[i].time),
                "high" : parseFloat(ticks[i].high),
                "low" : parseFloat(ticks[i].low),
                "open" : parseFloat(ticks[i].open),
                "close" : parseFloat(ticks[i].close),
                "volume" : parseFloat(ticks[i].volume),
                "closeTime" : ticks[i].closeTime,
                "readableCloseTime" : utils.lib.time.getReadableLocalTime(ticks[i].closeTime)
            })
        }
        return allTicks

    }


    async getCandlesfromApi(pair, candleSize, noOfCandles = 0, startTime = null, endTime = null) {
        var candleCountInfo

        if(startTime && endTime){
            candleCountInfo = {
                "startTime" : startTime,
                "endTime" : endTime,
                // "limit" : 999
            }
        }
        else{
            candleCountInfo = {
                "limit" : noOfCandles
            }
        }

        return new Promise((resolve, reject) => {
            this.exchange.candlesticks(pair, candleSize, (error, ticks, symbol) => {
                if(error) {
                    console.log(error)
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
                        "volume" : parseFloat(ticks[i][5]),
                        "closeTime" : ticks[i][6]
                    })
                }
                resolve(allTicks);
            }, candleCountInfo);
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