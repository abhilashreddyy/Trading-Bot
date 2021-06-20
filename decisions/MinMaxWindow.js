class MinMaxTracker{
    constructor(lastNCandles, windowSize){
        this.metric = "close"
        this.prevCandles = []
        this.windowSize = windowSize
        this.currRangeMax = {
            "value" : Number.NEGATIVE_INFINITY,
            "index" : -1
        }
        this.currRangeMin = {
            "value" : Number.POSITIVE_INFINITY,
            "index" : -1
        }
        this.initialCalculation(lastNCandles)
    }



    initialCalculation(lastNCandles){
        // // console.log(this.prevCandles)
        this.calculateInitialMaxMin(lastNCandles)
        
    }


    calculateInitialMaxMin(prevCandles){
        for(let i = 0; i < prevCandles.length; i++){
            this.update(prevCandles[i])
            
        }
    }

    getMaximumInWindow(st, en){
        var currMax = {
            "value" : Number.NEGATIVE_INFINITY,
            "index" : -1
        }
        for(var i = st;i < en; i++){
            if(this.prevCandles[i][this.metric] > currMax.value){
                currMax.value = this.prevCandles[i][this.metric]
                currMax.index = i
            }
        }
        return currMax
    }

    getMinimumInWindow(st, en){
        var currMax = {
            "value" : Number.POSITIVE_INFINITY,
            "index" : -1
        }
        for(var i = st;i < en; i++){
            if(this.prevCandles[i][this.metric] < currMax.value){
                currMax.value = this.prevCandles[i][this.metric]
                currMax.index = i
            }
        }
        return currMax
    }

    updateMaxMin(candleObj){// can be improved in time complexity
        this.currRangeMax = this.getMaximumInWindow(Math.max(this.prevCandles.length-this.windowSize,0), this.prevCandles.length)
        
        this.currRangeMin = this.getMinimumInWindow(Math.max(this.prevCandles.length-this.windowSize,0), this.prevCandles.length)

    }

    update(candleObj){
        this.prevCandles.push(candleObj)
        this.updateMaxMin(candleObj)
        
    }

    getLatestNCandle(l){
        // // console.log(this.prevMovingAvg)
        return this.prevCandles[this.prevCandles.length-l-1]
    }

    getNthCandle(n){
        return this.prevCandles[n]
    }

    getQuantifiedAvg(oldValue){       
        var oldRange = (this.currRangeMax.value - this.currRangeMin.value)  
        var newRange = 1-0
        var newValue = (((oldValue - this.currRangeMin.value) * newRange) / oldRange) + 0
        // console.log("quantified Value : ",newValue)
        return newValue
    }

    getTopNPercentile(n){
        return this.currRangeMin.value+(this.currRangeMax.value - this.currRangeMin.value)*(n/100)
    }

    checkBuyBaseCondition(buyPercentile){
        return this.getLatestNCandle(0)[this.metric] < this.getTopNPercentile(buyPercentile)

    }

    checkSellBaseCondition(sellPercentile){
        return this.getLatestNCandle(0)[this.metric] > this.getTopNPercentile(sellPercentile)

    }

    isIncreasing(){
        return this.getLatestNCandle(0)[this.metric] > this.getLatestNCandle(1)[this.metric]
    }


    getCurrentMinMaxInfo(){
        return {
            "min" : {
                "value" : this.currRangeMin.value,
                "time" : this.prevCandles[this.currRangeMin.index].readableTime
            },
            "max" : {
                "value" : this.currRangeMax.value,
                "time" : this.prevCandles[this.currRangeMax.index].readableTime
            }
        }
    }
    



}

// var temp = new MinMaxTracker([{"close" : 23},{"close" : 84},{"close" : 15},{"close" : 21},{"close" : 35}],3)
// console.log(temp.currRangeMax, temp.currRangeMin, temp.checkBuyBaseCondition(45), temp.checkSellBaseCondition(55))



class MinMaxWindow{
    constructor(config, queryObj){//lastNCandles.length >= slowN
        // this.transactionHistory = new decionObj.transactionHistory()
        
        this.lastDecision = null
        this.queryObj = queryObj
        this.exchange = config.exchange
        this.conversion = config.conversion

        this.config = config.algoConfig[config.algorithm]
        
        this.buyLock = 0
        this.sellLock = 1
        this.buyTrigger = null
        this.sellTrigger = null

        this.minAfterCrossingBuyTrigger = Number.POSITIVE_INFINITY
        this.maxAfterCrossingSellTrigger = Number.NEGATIVE_INFINITY

        
    }

    async initialFetch(){

        let prevCandles = await this.queryObj.getCandles
                                            (this.conversion, this.config.data.timeFrame, 
                                                this.config.lastNCandles)
        this.minMaxTracker = new MinMaxTracker([...prevCandles], this.config.lastNCandles)
        // // console.log("preperty names : ",Object.getOwnPropertyNames(this.minMaxTracker))
    }

    async update(){
        
        let candleObj = await this.queryObj.getCandles(this.conversion, 
                                    this.config.data.timeFrame, 1)
        candleObj = candleObj[0]
        
        
        // console.log("current candle Obj : ", candleObj)
        this.minMaxTracker.update(candleObj)

        this.updateTracker()

    }

    updateTracker(){
        
        if(!(this.minMaxTracker.checkSellBaseCondition(this.config.sellPercentile) ||
          this.minMaxTracker.checkBuyBaseCondition(this.config.buyPercentile))){
            this.buyTrigger = null   
            this.sellTrigger = null
            this.minAfterCrossingBuyTrigger = Number.POSITIVE_INFINITY
            this.maxAfterCrossingSellTrigger = Number.NEGATIVE_INFINITY
        }
        
        if(this.sellLock == 0 && this.minMaxTracker.checkSellBaseCondition(this.config.sellPercentile)){
            console.log("entered sell")
            console.log("max after cross decision params // sell: ", this.minMaxTracker.getLatestNCandle(0).close, this.maxAfterCrossingSellTrigger)

            this.maxAfterCrossingSellTrigger = Math.max(this.minMaxTracker.getLatestNCandle(0).close, this.maxAfterCrossingSellTrigger)
        

            var sellBase = this.minMaxTracker.getTopNPercentile(this.config.sellPercentile)
            // var sellDropFromMax = this.maxAfterCrossingSellTrigger-this.minMaxTracker.getLatestNCandle(0).close

            this.sellTrigger = Math.max(this.maxAfterCrossingSellTrigger - this.config.maxSelldropVal,
                this.maxAfterCrossingSellTrigger - (this.maxAfterCrossingSellTrigger - sellBase)*(this.config.maxSelldropPercent/100))

        }
        else if(this.buyLock == 0 && this.minMaxTracker.checkBuyBaseCondition(this.config.buyPercentile)){
            console.log("entered buy")
            console.log("min after cross decision params // buy: ", this.minMaxTracker.getLatestNCandle(0).close, this.minAfterCrossingBuyTrigger)

            this.minAfterCrossingBuyTrigger = Math.min(this.minMaxTracker.getLatestNCandle(0).close, this.minAfterCrossingBuyTrigger)
            

            var buyBase = this.minMaxTracker.getTopNPercentile(this.config.buyPercentile)

            this.buyTrigger = Math.min(this.minAfterCrossingBuyTrigger + this.config.maxBuyraiseVal,
                this.minAfterCrossingBuyTrigger + (buyBase - this.minAfterCrossingBuyTrigger)*(this.config.maxbuyraisePercent/100))

        }
        console.log("\n\n")
        console.log("time : ", this.minMaxTracker.getLatestNCandle(0).readableTime)
        console.log("state buy-sell lock : ", this.buyLock," - ", this.sellLock)
        console.log("current min-max : ", this.minMaxTracker.getCurrentMinMaxInfo())

        console.log("curr-last candle obj : ", this.minMaxTracker.getLatestNCandle(0).close, this.minMaxTracker.getLatestNCandle(1).close)
        // console.log("latest n th candle ; ",this.minMaxTracker.checkBuyBaseCondition(10))
        console.log("maxAfterCrossingSellTrigger : ", this.maxAfterCrossingSellTrigger)
        console.log("sell base : ",this.minMaxTracker.checkSellBaseCondition(this.config.sellPercentile), this.minMaxTracker.getTopNPercentile(this.config.sellPercentile))
        console.log("raise after sell : ", (sellBase - this.maxAfterCrossingSellTrigger)*(this.config.maxSellraisePercent/100))


        console.log("minAfterCrossingBuyTrigger : ", this.minAfterCrossingBuyTrigger)
        console.log("buy base : ",this.minMaxTracker.checkBuyBaseCondition(this.config.buyPercentile), this.minMaxTracker.getTopNPercentile(this.config.buyPercentile))
        console.log("raise after buy : ", (buyBase - this.minAfterCrossingBuyTrigger)*(this.config.maxbuyraisePercent/100))

        console.log("buy trigger / sell trigger : ",this.buyTrigger , this.sellTrigger)
        



    }


    async whatToDo(){
        var lastCandle = this.minMaxTracker.getLatestNCandle(0)
        if(this.sellLock == 0 &&
        this.sellTrigger > this.minMaxTracker.getLatestNCandle(0).close){
            // console.log("entered sell")
            this.buyLock = 0
            this.sellLock = 1
            this.maxAfterCrossingSellTrigger = null
            this.sellTrigger = null
            console.log("entered sell action")
            

            return {
                "action" : "sell",
                "price" : await this.queryObj.getPrice(this.exchange),
                "time" : lastCandle.time,
                "readableTime" : lastCandle.readableTime,
                "fraction" : 1,
                "buyBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.buyPercentile),
                "sellBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.sellPercentile)
            }
        
        }
        else if(this.buyLock == 0 && 
                this.buyTrigger < this.minMaxTracker.getLatestNCandle(0).close){
            // console.log("entered buy")
            this.buyLock = 1
            this.sellLock = 0
            this.minAfterCrossingBuyTrigger = null
            console.log("entered byu action")
            this.buyTrigger = null
            return {
                "action" : "buy",
                "price" : await this.queryObj.getPrice(this.exchange),
                "time" : lastCandle.time,
                "readableTime" : lastCandle.readableTime,
                "fraction" : 1,
                "buyBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.buyPercentile),
                "sellBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.sellPercentile)
            }
            
        }
        else{
            return {
                "action" : "observe",
                "time" : lastCandle.time,
                "readableTime" : lastCandle.readableTime,
                "buyBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.buyPercentile),
                "sellBaseCondition" : this.minMaxTracker.getTopNPercentile(this.config.sellPercentile)
            }
        }
        
    }


}

module.exports = MinMaxWindow