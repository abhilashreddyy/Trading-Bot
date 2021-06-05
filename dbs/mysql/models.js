class candleTable{
    constructor(connection, config){
        this.connection = connection
        this.config = config
        
        this.tableName = this.getTableName()

        if(!this.tableExists()){
            this.createTable()
        }
    }

    getTableName(){
        var algorithm = config.algorithm
        return config.conversion + "_" + config.algoConfig[algorithm].data.timeFrame
                + "_" +"candles" //config.algoConfig[algorithm].data.type
    }

    tableExists(){
        return new Promise((resolve, reject)=>{
            
        })
    }

    




    
    
}