queryHelper = require("./utils/queryHelper")

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
                    console.log("sucessfully inserted ID's: ",results.insertId);
                    resolve()
                }
            })
        })
    }
}



class candlesTable extends Table{
    constructor(connection, config, tableName){
        const schema = {
            "time" : "int unsigned NOT NULL PRIMARY KEY", 
            "open" : "float", 
            "close" : "float", 
            "high" : "float", 
            "low" : "float", 
            "closeTime" : "int unsigned", 
            "volume" : "float"
        }
        super(connection, config, schema, tableName)
        this.schema = schema
        this.connection = connection
        this.config = config
        this.tableName = tableName
    }
}

class transactionsTable extends Table{
    constructor(connection, config, tableName){
        const schema = {
            "time" : "int unsigned NOT NULL PRIMARY KEY", 
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