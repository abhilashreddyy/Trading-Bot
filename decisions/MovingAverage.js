
var decionObj = require("./utils/objects")




class MovingAvg{
    constructor(n, lastNCandles){
        this.n = n
        this.prevCandles = lastNCandles
        this.prevMovingAvg = []
        this.initialCalculation()
    }

    initialCalculation(){
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
    constructor(lastNCandles, config){//lastNCandles.length >= slowN
        // this.transactionHistory = new decionObj.transactionHistory()
        this.fastMovingAvg = new MovingAvg(config.fastN,lastNCandles)
        this.slowMovingAvg = new MovingAvg(config.slowN, lastNCandles)
        this.currentStatus = this.getCurrentStatus()
        this.lastDecision = null
    }


    updateCandles(candleObj, lastTransaction = null){
        this.fastMovingAvg.update(candleObj)
        this.slowMovingAvg.update(candleObj)
        this.lastTransaction.update(lastTransaction)
        // this.whatToDo()
    }



    whatToDo(){
        if(this.isCrossing()){
            if(this.currentStatus == "raising"){
                this.currentStatus = this.getCurrentStatus()
                return "sell"
            }
            else if(this.currentStatus == "falling"){
                this.currentStatus = this.getCurrentStatus()
                return "buy"
            }
        }
        else{
            return "observe"
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