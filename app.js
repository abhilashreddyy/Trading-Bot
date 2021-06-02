const config = require("./config/config")
const exchangeMain = require(`./data`)[config.exchange];
const simulationMain = require(`./data`)["simulation"]
var tradingDecision = require("./decisions")


async function init(){
    var exchangeObj = exchangeMain.init()
    var queryObj = new exchangeMain.Queries(exchangeObj)
    if(config.simulation){
        queryObj = new simulationMain.Queries(queryObj, config)
        await queryObj.initialFetch()
    }

    let tradingAlgo = tradingDecision[config.algorithm]
    let tradingObj = new tradingAlgo(config, queryObj)
    await tradingObj.initialFetch()

    if(config.simulation){
        var algoConf = config.algoConfig[config.algorithm]
        for(var i = 0; i < algoConf.fetchConfig.nTest-algoConf.lastNCandles-1; i++){
            result = await tradingObj.whatToDo()
            console.log(result)
            await tradingObj.updateCandles()
        }
    }
    
    tradeObj = await tradingObj.whatToDo()



}

init()