
const unitTimeFrame= {
    "binance":{
        "15m" : 15*60*1000,
        "1m" : 1*60*1000
    }
}

function getUnitTime(exchange, unitSize){
    return unitTimeFrame[exchange][unitSize]
}

function getCurrentUnixTimestamp(){
    return Date.now()
}

function getUnixTimestampsRange(exchange, unitSize, lastN){
    var currTime = getCurrentUnixTimestamp()
    var unitTime = getUnitTime(exchange,unitSize)
    currTime = currTime-currTime%unitTime
    return {
        "end" : currTime,
        "start" : currTime-lastN*unitTime
    }
}

function getReadableLocalTime(unixTimeStamp){

    var dt = new Date(unixTimeStamp)
    return dt.toLocaleString()
}



module.exports = {
    getCurrentUnixTimestamp,
    getUnixTimestampsRange,
    getUnitTime,
    getReadableLocalTime
}