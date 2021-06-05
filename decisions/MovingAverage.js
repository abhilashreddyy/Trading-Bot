
const { movingAverage } = require(".")
var decionObj = require("./utils/objects")




class MovingAvg{
    constructor(n, lastNCandles){
        this.n = n
        this.metric = "close"
        this.prevCandles = lastNCandles
        this.prevMovingAvg = []
        
        this.initNCandles = lastNCandles
        this.currRangeMax = Number.NEGATIVE_INFINITY
        this.currRangeMin = Number.POSITIVE_INFINITY
        this.initialCalculation()
    }



    initialCalculation(){
        // console.log(this.prevCandles)
        this.calculateInitialMovingAverage()
        this.calculateInitialMaxMin()
        
    }

    calculateInitialMovingAverage(){
        if(this.prevCandles.length < this.n){
            return // Throw error
        }
        else{
            console.log("calculating initial moving averages")
            console.log("length of moving AVG : ",this.n)
            console.log("length of all candles : ",this.prevCandles.length)
            for(let i = this.n; i <= this.prevCandles.length; i++){
                console.log("prev candles : ", i-this.n, i)
                this.prevMovingAvg.push(this.calculateMovingAvg(i, 0))
            }
        }
    }

    calculateInitialMaxMin(){
        for(let i = 0; i < this.prevCandles.length; i++){
            this.updateMaxMin(this.prevCandles[i])
            
        }
    }

    updateMaxMin(candleObj){
        if(candleObj[this.metric] > this.currRangeMax){
            this.currRangeMax = candleObj[this.metric]
        }
        if(candleObj[this.metric] < this.currRangeMin){
            this.currRangeMin = candleObj[this.metric]
        }
    }

    calculateMovingAvg(i, temp = 1){ // i == index in prevCandles
        let result = 0;
        let tempSlice = this.prevCandles.slice(i-this.n, i)
        // console.log("prev candles : ", this.prevCandles)
        
        console.log("averaging candles : ", tempSlice)
        
        for(let i = 0; i < tempSlice.length; i++){
            // console.log(`current candleval ${i} : `, tempSlice[i])
            console.log("current moving Avg closing val/time/closeTime : ",tempSlice[i].close," / ",(new Date(tempSlice[i].time)), (new Date(tempSlice[i].closeTime)))
            // result += (parseFloat(tempSlice[i].open)+parseFloat(tempSlice[i].close))/2;
            result += parseFloat(tempSlice[i][this.metric])
        }
        // moving avg logic
        var val = result/this.n
        console.log("moving average : ",val, "\n")
        return val
    }


    update(candleObj){
        this.updateMovingAvg(candleObj)
        this.updateMaxMin(candleObj)
    }


    updateMovingAvg(candleObj){
        console.log("updating moving avg")
        console.log("pushing new candle val : ", candleObj)
        this.prevCandles.push(candleObj)
        
        let newMovingAvg = this.calculateMovingAvg(this.prevCandles.length-1)
        console.log("calculating moving average : ", newMovingAvg)
        this.prevMovingAvg.push(newMovingAvg)

    }

    getLatestNAvg(l){
        // console.log(this.prevMovingAvg)

        return this.prevMovingAvg[this.prevMovingAvg.length-l-1]
    }

    getQuantifiedAvg(oldValue){       
        var oldRange = (this.currRangeMax - this.currRangeMin)  
        var newRange = 1-0
        var newValue = (((oldValue - this.currRangeMin) * newRange) / oldRange) + 0
        console.log("quantified Value : ",newValue)
        return newValue
    }

    getLastNSlope(l){
        if(this.prevMovingAvg.length > 1){
            var latestAvg = this.getLatestNAvg(l)
            var latestButOneAvg = this.getLatestNAvg(l+1)
            latestAvg = this.getQuantifiedAvg(latestAvg) // might not work if l is very large outof the window problem
            latestButOneAvg = this.getQuantifiedAvg(latestButOneAvg)
            console.log("latest slope : ", latestAvg-latestButOneAvg)
            return latestAvg-latestButOneAvg
        }
        else{
            console.log("error") // throw error
        }
        
    }



}




class MovingAverageAlgo{
    constructor(config, queryObj){//lastNCandles.length >= slowN
        // this.transactionHistory = new decionObj.transactionHistory()
        
        this.currentStatus = null
        this.lastDecision = null
        this.queryObj = queryObj
        this.exchange = config.exchange
        this.conversion = config.conversion

        this.config = config.algoConfig[config.algorithm]
        
        this.buyLock = 0
        this.sellLock = 1

        this.fastMovingAvg = null
        this.slowMovingAvg = null

        
    }

    async initialFetch(){
        let prevCandles = await this.queryObj.getCandleVals
                                            (this.conversion, this.config.data.timeFrame, 
                                                this.config.lastNCandles)
        // console.log("hello ; ",prevCandles)
        this.fastMovingAvg = new MovingAvg(this.config.fastN,[...prevCandles])
        this.slowMovingAvg = new MovingAvg(this.config.slowN, [...prevCandles])
        this.currentStatus = this.getCurrentStatus()
    }

    async updateCandles(){
        let candleObj = await this.queryObj.getCandleVals(this.conversion, 
                                    this.config.data.timeFrame, 1)[0]
        console.log("current candle Obj : ", candleObj)
        var c = new Date(candleObj.closeTime);
        var o = new Date(candleObj.time);

        console.log("time and closing time:",o,c)
        this.fastMovingAvg.update(candleObj)
        this.slowMovingAvg.update(candleObj)
        // this.lastTransaction.update(lastTransaction)
        // this.whatToDo()
    }



    async whatToDo(){
        console.log("current status : ", this.currentStatus)
        if(this.isCrossing()){
            if(this.currentStatus == "raising" ){
                if(this.sellLock == 0){
                    this.currentStatus = this.getCurrentStatus()
                    this.sellLock = 1
                    this.buyLock = 0
                    return {
                        "action" : "sell",
                        // "time" : await this.queryObj.getTime(),
                        "price" : await this.queryObj.getcurrentPrice(this.exchange),
                        "fastSlope" : this.fastMovingAvg.getLastNSlope(0),
                        "slowSlope" : this.slowMovingAvg.getLastNSlope(0),
                        "fraction" : 1
                    }
                }
                else{
                    return {
                        "action" : "sell skip",
                        "price" : await this.queryObj.getcurrentPrice(this.exchange),
                        "fastSlope" : this.fastMovingAvg.getLastNSlope(0),
                        "slowSlope" : this.slowMovingAvg.getLastNSlope(0),
                        "time" : await this.queryObj.getTime()
                    }
                }
                
            }
            else if(this.currentStatus == "falling"){
                if(this.buyLock == 0 && this.checkBuySlopeFavaorability()){
                    this.currentStatus = this.getCurrentStatus()
                    this.sellLock = 0
                    this.buyLock = 1
                    return {
                        "action" : "buy",
                        // "time" : await this.queryObj.getTime(),
                        "fastSlope" : this.fastMovingAvg.getLastNSlope(0),
                        "slowSlope" : this.slowMovingAvg.getLastNSlope(0),
                        "price" : await this.queryObj.getcurrentPrice(this.exchange),
                        "fraction" : 1
                    }
                }
                else{
                    return {
                        "action" : "buy skip",
                        "price" : await this.queryObj.getcurrentPrice(this.exchange),
                        "fastSlope" : this.fastMovingAvg.getLastNSlope(0),
                        "slowSlope" : this.slowMovingAvg.getLastNSlope(0),
                        "time" : await this.queryObj.getTime()
                    }
                }
            }

            
        }
        else{
            this.currentStatus = this.getCurrentStatus()
            return{
                "action" : "observe",
                "time" : await this.queryObj.getTime()
            }
        }
    }

    isCrossing(){
        console.log("slow moving avg curr/last: ", this.slowMovingAvg.getLatestNAvg(0), this.slowMovingAvg.getLatestNAvg(1))
        console.log("fast moving avg curr/last: ", this.fastMovingAvg.getLatestNAvg(0), this.fastMovingAvg.getLatestNAvg(1))
        if(this.slowMovingAvg.getLatestNAvg(1) > this.fastMovingAvg.getLatestNAvg(1) &&
           this.slowMovingAvg.getLatestNAvg(0) < this.fastMovingAvg.getLatestNAvg(0)){
            return 1
        }
        else if(this.slowMovingAvg.getLatestNAvg(1) < this.fastMovingAvg.getLatestNAvg(1) &&
                this.slowMovingAvg.getLatestNAvg(0) > this.fastMovingAvg.getLatestNAvg(0)){
            return 1
        }
        else{
            return 0
        }
    }

    getCurrentStatus(){
        
        if(this.slowMovingAvg.getLatestNAvg(0) > this.fastMovingAvg.getLatestNAvg(0)){
            return "falling"
        }
        else{
            return "raising"
        }
        
    }

    checkBuySlopeFavaorability(){
        var fastMovingSlope = this.fastMovingAvg.getLastNSlope(0)
        var slowMovingSlope = this.slowMovingAvg.getLastNSlope(0)
        console.log("fast/slow moving slope : ",fastMovingSlope," / ",slowMovingSlope)
        if((fastMovingSlope < 0 && slowMovingSlope < 0)||
            fastMovingSlope < 0 && slowMovingSlope < 0){
            return 0
        }
        else{
            return 1
        }
    }
}

module.exports = MovingAverageAlgo