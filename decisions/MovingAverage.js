
var decionObj = require("./utils/objects")




class MovingAvg{
    constructor(n, lastNCandles){
        this.n = n
        this.prevCandles = lastNCandles
        this.prevMovingAvg = []
        this.initialCalculation()
    }



    initialCalculation(){
        // console.log(this.prevCandles)
        if(this.prevCandles.length < this.n){
            return // Throw error
        }
        else{
            for(let i = this.n; i <= this.prevCandles.length; i++){
                this.prevMovingAvg.push(this.calculateMovingAvg(i))
            }
        }
    }

    calculateMovingAvg(i){ // i == index in prevCandles
        let result = 0;
        this.prevCandles.slice(i-this.n, i).forEach(element => {
            result += (element.open+element.close)/2; // moving avg logic
        });
        return result
    }

    update(candleObj){
        this.prevCandles.push(candleObj)
        let newMovingAvg = this.calculateMovingAvg(this.prevCandles.length-1)
        this.prevMovingAvg.push(newMovingAvg)
    }

    getLatestNAvg(l){
        return this.prevMovingAvg[this.prevMovingAvg.length-l]
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
        

        this.fastMovingAvg = null
        this.slowMovingAvg = null

        
    }

    async initialFetch(){
        let prevCandles = await this.queryObj.getCandleVals
                                            (this.conversion, this.config.data.timeFrame, 
                                                this.config.lastNCandles)
        // console.log("hello ; ",prevCandles)
        this.fastMovingAvg = new MovingAvg(this.config.fastN,prevCandles)
        this.slowMovingAvg = new MovingAvg(this.config.slowN, prevCandles)
        this.currentStatus = this.getCurrentStatus()
    }

    updateCandles(candleObj, lastTransaction = null){
        this.fastMovingAvg.update(candleObj)
        this.slowMovingAvg.update(candleObj)
        this.lastTransaction.update(lastTransaction)
        // this.whatToDo()
    }



    async whatToDo(){
        if(this.isCrossing()){
            if(this.currentStatus == "raising"){
                this.currentStatus = this.getCurrentStatus()
                return {
                    "action" : "sell",
                    "time" : await this.queryObj.getTime(),
                    "price" : await this.queryObj.getcurrentPrice(this.exchange),
                    "fraction" : 1
                }
            }
            else if(this.currentStatus == "falling"){
                this.currentStatus = this.getCurrentStatus()
                return {
                    "action" : "buy",
                    "time" : await this.queryObj.getTime(),
                    "price" : await this.queryObj.getcurrentPrice(this.exchange),
                    "fraction" : 1
                }
            }
        }
        else{
            return {
                "action" : "observe",
                "time" : await this.queryObj.getTime()
            }
        }
    }

    isCrossing(){
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
}

module.exports = MovingAverageAlgo