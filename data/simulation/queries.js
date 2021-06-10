class Queries{
    constructor(queryObj, mysqlOps ,config){
        this.conversion = config.conversion
        this.queryObj = queryObj
        this.nPast = []
        this.i = 0
        this.config = config.algoConfig[config.algorithm]
    }

    async initialFetch(){
        if(this.config.data.type == "candles"){
            this.nPast = await this.initFetchCandles(this.config)
        }
        await this.queryObj.initialFetch()

    }

    async initFetchCandles(){
        console.log(`fetching ${this.config.fetchConfig.nTest} candles for simulation`)
        
        return (await this.queryObj.getCandles
                        (this.conversion, this.config.data.timeFrame,
                            this.config.fetchConfig.nTest));
    }

    getCandles(conversion, duration, limit){
        return (new Promise((resolve,reject)=>{
            if(this.config.data.timeFrame == duration && this.conversion == conversion){
                var currVals = this.nPast.slice(this.i, this.i+limit);
                this.i+=limit
                console.log("resolving")
                resolve(currVals)
            }
            else{
                reject("error there is a mismatch")
            }
        }));
        
    }

    getTime(){
        console.log("get time ; ",this.nPast.length,this.nPast[this.i], this.i)
        return this.nPast[this.i].time
    }

    getPrice(conversion){
        if(this.config.data.type == "candles"){
            return this.nPast[this.i-1].open
        }
    }
    

}

module.exports = Queries