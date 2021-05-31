const config = require("./config/config")
const exchangeQuery = require(`./data`)[config.exchangeConf.exchange];
var tradingDecision = require("./decisions")


exchangeObj = exchangeQuery.init()


exchangeQuery.queries.getCandleVals(exchangeObj,
                        config.exchangeConf.conversion, config.exchangeConf.timeFrame,
                         config.exchangeConf.lastNCandles).then((allTicks)=>{
    tradingAlgo = tradingDecision[config.algorithm]
    let tradingObj = new tradingAlgo(allTicks, config.algoConfig[config.algorithm])
    console.log(tradingObj.whatToDo())
})

