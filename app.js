const config = require("./config/config")
const exchangeMain = require(`./data`)[config.exchange]
const simulationMain = require(`./data`)["simulation"]
var tradingDecision = require("./decisions")

console.log(config.simulation)
if(config.simulation){
    var Trader = require(`./trades`)
}
else{
    var Trader = require(`./trades`)
}

console.log(Trader)




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
            var traderObj = new Trader(currency1 = 0, currency2 = 1, conversion = queryObj.getcurrentPrice())
            for(var i = 0; i < algoConf.fetchConfig.nTest-algoConf.lastNCandles-1; i++){
                console.log("start")
                await tradingObj.updateCandles()
                var tradeVal = await tradingObj.whatToDo()
                console.log("action : ",tradeVal,"\n\n")
                await traderObj.trade(tradeVal)

                

                
            }
        }
        console.log("ledger details : ",traderObj.ledger)
        tradeObj = await tradingObj.whatToDo()

    } catch(e){
        console.log(e)
    }
    


}

init()