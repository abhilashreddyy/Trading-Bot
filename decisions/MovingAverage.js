
const { movingAverage } = require(".")
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
            console.log("calculating initial moving averages")
            console.log("length of moving AVG : ",this.n)
            console.log("length of all candles : ",this.prevCandles.length)
            for(let i = this.n; i <= this.prevCandles.length; i++){
                console.log("prev candles : ", i-this.n, i)
                this.prevMovingAvg.push(this.calculateMovingAvg(i, 0))
            }
        }
    }

    calculateMovingAvg(i, temp = 1){ // i == index in prevCandles
        let result = 0;
        let tempSlice = this.prevCandles.slice(i-this.n, i)
        // console.log("prev candles : ", this.prevCandles)
        

        
        for(let i = 0; i < tempSlice.length; i++){
            console.log("current candleval : ", tempSlice[i])
            console.log("current moving Avg closing val/time/closeTime : ",tempSlice[i].close," / ",(new Date(tempSlice[i].time)), (new Date(tempSlice[i].closeTime)))
            // result += (parseFloat(tempSlice[i].open)+parseFloat(tempSlice[i].close))/2;
            result += parseFloat(tempSlice[i].close)
        }
        // moving avg logic
        var val = result/this.n
        console.log("moving average : ",val, "\n")
        return val
    }


    update(candleObj){
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
            if(this.currentStatus == "raising"){
                this.currentStatus = this.getCurrentStatus()
                return {
                    "action" : "sell",
                    // "time" : await this.queryObj.getTime(),
                    "price" : await this.queryObj.getcurrentPrice(this.exchange),
                    "fraction" : 1
                }
            }
            else if(this.currentStatus == "falling"){
                this.currentStatus = this.getCurrentStatus()
                return {
                    "action" : "buy",
                    // "time" : await this.queryObj.getTime(),
                    "price" : await this.queryObj.getcurrentPrice(this.exchange),
                    "fraction" : 1
                }
            }
        }
        else{
            this.currentStatus = this.getCurrentStatus()
            return {
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
}

module.exports = MovingAverageAlgo