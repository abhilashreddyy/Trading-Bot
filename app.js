const config = require("./config/config.json");
const Data = require(`./data`);
var tradingDecision = require("./decisions")
var dbOps = require("./dbs")


// console.log(config.simulation)
if(config.simulation){
    var Trader = require(`./trades`)
}
else{
    var Trader = require(`./trades`)
}

// console.log(Trader)

async function init(){
    mysqlOps = new dbOps.mysqlOps(config)
    await mysqlOps.init()
    const dataInstance = new Data(config.exchange, config.simulation, mysqlOps);
    await dataInstance.initialFetch();
    // console.log("data instance : ",Object.getOwnPropertyNames(dataInstance))

    // console.log("trading decision : ", tradingDecision)
    let tradingAlgo = tradingDecision[config.algorithm];

    let algoInstance = new tradingAlgo(config, dataInstance);
    await algoInstance.initialFetch()

    const algoConf = config.algoConfig[config.algorithm];
    if(config.simulation){
        // console.log("starting simulation")
        var traderObj = new Trader(currency1 = 0, currency2 = 1, conversion = await dataInstance.getPrice())
        for(var i = 0; i < dataInstance.queries.nPast.length-algoConf.lastNCandles-1; i++){
            // console.log("start")
            await algoInstance.update()
            var tradeVal = await algoInstance.whatToDo()
            // console.log("action : ",tradeVal,"\n\n")
            await traderObj.trade(tradeVal)

            
        }
        // return;
        console.log("ledger details : ")
        for(let j = 0; j < traderObj.ledger.length; j++){
            console.log(traderObj.ledger[j])
        }
        mysqlOps.terminate()
    }
    
    // tradeObj = await algoInstance.whatToDo()
}

init()