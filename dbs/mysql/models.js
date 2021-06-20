const queryHelper = require("./utils/queryHelper")
const utils = require("../../utils")


class Table{
    
    constructor(connection, config, schema, tableName){
        this.config = config
        this.schema = schema
        this.tableName = tableName
        this.queryConstructor = new queryHelper.queryConstructor(this.schema, this.tableName)
        this.connection = connection        
    }

    async init(){
        return await this.checkAndCreateTable()
    }

    async checkAndCreateTable(){
        const status = await this.tableExists();
        if(status == "not found") {
            await this.createTable();
        }
        return;
        
    }

    tableExists(){
        return new Promise((resolve)=>{
            this.connection.query('SHOW tables', (error, results, fields) => {
                if (error) throw error;
                else{
                    if(results.some(val => val["Tables_in_"+this.config.exchange] == this.tableName)){
                        
                        resolve("found")
                    }
                    else{
                        resolve("not found")
                    }
                }
            })
        })
    }

    createTable(){
        return new Promise((resolve)=>{
            this.connection.query(this.queryConstructor.creationQuery(), function(error, results, fields){
                if(error) throw error;
                resolve("table created")
            })
        })
    }  
    
    addRows(newRows){//use this only if you are sure of adding new rows
        return new Promise((resolve)=>{
            var insertionVars = this.queryConstructor.insertionQuery(newRows)
            this.connection.query(insertionVars["query"],[insertionVars["tupleList"]], (error, results, fields)=>{
                if (error) throw error;
                resolve()
            })
        })
    }

    addRow(newRow){
        return new Promise((resolve, reject)=>{
            var insertionVars = this.queryConstructor.insertionQuery([newRow])
            this.connection.query(insertionVars["query"],[insertionVars["tupleList"]], (error, results, fields)=>{
                if (error){
                    
                    reject(error) 
                }
                else{
                    // console.log("sucessfully inserted ID's: ",results.insertId);
                    resolve()
                }
            })
        })
    }
}



class candlesTable extends Table{
    constructor(connection, config, tableName){
        const schema = {
            "time" : "bigint unsigned NOT NULL PRIMARY KEY", 
            "open" : "float", 
            "close" : "float", 
            "high" : "float", 
            "low" : "float", 
            "closeTime" : "bigint unsigned", 
            "volume" : "float"
        }
        super(connection, config, schema, tableName)
        this.schema = schema
        this.connection = connection
        this.config = config
        this.tableName = tableName
    }

    async getUnavailableTimeRanges(timeStampsRange){
        var results = await this.getDatabaserange(timeStampsRange)
        var unavailableRanges = this.getTimeRangeGaps(results, timeStampsRange)
        // console.log("un available ranges : ",unavailableRanges)
        return unavailableRanges
    }

    getDatabaserange(timeStampsRange){
        return (new Promise((resolve, reject)=>{
            var query = `select * from ${this.tableName} where time >= ${timeStampsRange["start"]} and time <= ${timeStampsRange["end"]} order by time asc`
            // console.log(query)
            this.connection.query(query,(error, results, fields)=>{
                if(error) throw error
                resolve(results)
            })
        }));
    }


    
    getTimeRangeGaps(queryTimeStamps,timeStampsRange){
        // console.log("query F/L : ",queryTimeStamps[0], queryTimeStamps[queryTimeStamps.length-1])
        // console.log(timeStampsRange)
        var windowStart = timeStampsRange["start"]
        var queryPointer = 0
        var unavailableRanges = []
        var unitTime = utils.lib.time.getUnitTime(this.config.exchange, this.config.algoConfig[this.config.algorithm].data.timeFrame)
        // console.log("nstaps : ",(timeStampsRange.end-timeStampsRange.start)/unitTime)
        var i
        // console.log(unitTime)
        for(i = timeStampsRange["start"]; i <= timeStampsRange["end"]; i=i+unitTime){
            if(queryTimeStamps.length > 0 && queryPointer < queryTimeStamps.length){
                if(queryTimeStamps[queryPointer].time == i){
                    if(i != windowStart){
                        unavailableRanges.push([windowStart,i])
                        
                    }
                    queryPointer+=1
                    windowStart = i+unitTime
                    
                }
                
            } 
            
            
        }
        if(windowStart<timeStampsRange["end"]) unavailableRanges.push([windowStart,timeStampsRange["end"]])
        // console.log("un available ranges : ", unavailableRanges)
        unavailableRanges = this.breakRange(unavailableRanges,unitTime)
        return unavailableRanges
    } 


    breakRange(unavailableRanges, unitTime){
        var newRange = []
        var maxPerRequest = this.config.maxElementsPerRequest
        // // console.log("max : ",maxPerRequest)
        for(var i = 0; i < unavailableRanges.length; i++){
            var baseVal = unavailableRanges[i][0]
            // // console.log(baseVal,baseVal+maxPerRequest*unitTime, unavailableRanges[i][1])
            while(baseVal+maxPerRequest*unitTime < unavailableRanges[i][1]){
                newRange.push([baseVal,baseVal+maxPerRequest*unitTime-1])
                baseVal = baseVal+maxPerRequest*unitTime
            }
            if(baseVal < unavailableRanges[i][1]){
                newRange.push([baseVal,unavailableRanges[i][1]])
            }
        }
        // console.log("newRange : ",newRange)
        return newRange
    }
}

class transactionsTable extends Table{
    constructor(connection, config, tableName){
        const schema = {
            "time" : "bigint unsigned NOT NULL PRIMARY KEY", 
            "action" : "varchar(50)", 
            "tokenPrice" : "float", 
            "netProfit" : "float", 
            "currentProfit" : "float", 
            "baseCurrencyBeforeTransaction" : "float", 
            "baseCurrencyAfterTransaction" : "float",
            "tokenCurrencyBeforeTransaction" : "float", 
            "tokenCurrencyAfterTransaction" : "float",
            "timeFrame" : "varchar(50)"
        }
        super(connection, config, schema, tableName)
        this.schema = schema
        this.connection = connection
        this.config = config
        this.tableName = tableName
    }

    
}



module.exports = {
    candlesTable,
    transactionsTable
}