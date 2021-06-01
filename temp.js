const config = require("./config/config")
const exchangeQuery = require(`./data`)[config.exchange];
exchangeObj = exchangeQuery.init()

async function temp(){
    time = await exchangeObj.futuresTime()
    console.log(time)
}

temp()