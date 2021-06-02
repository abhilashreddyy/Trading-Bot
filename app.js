const config = require("./config/config")
const exchangeMain = require(`./data`)[config.exchange];
const simulationMain = require(`./data`)["simulation"]
var tradingDecision = require("./decisions")


async function init(){
    try{
        
        var exchangeObj = exchangeMain.init()
        var queryObj = new exchangeMain.Queries(exchangeObj)
        if(config.simulation){
            queryObj = new simulationMain.Queries(queryObj, config)
            console.log("fetching initial stuff for simulation")
            await queryObj.initialFetch()
        }

        let tradingAlgo = tradingDecision[config.algorithm]
        let tradingObj = new tradingAlgo(config, queryObj)
        await tradingObj.initialFetch()


        if(config.simulation){
            console.log("starting simulation")
            var algoConf = config.algoConfig[config.algorithm]
            for(var i = 0; i < algoConf.fetchConfig.nTest-algoConf.lastNCandles-1; i++){
                console.log("start")
                await tradingObj.updateCandles()
                result = await tradingObj.whatToDo()
                console.log(result,"\n\n")
                
            }
        }
        
        tradeObj = await tradingObj.whatToDo()

    } catch(e){
        console.log(e)
    }
    


}

init()