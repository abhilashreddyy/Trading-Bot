const models = require("./models")
const mysql = require("mysql")
const keys = require("../../config/keys.json");


class Connection{
    constructor(config){
        this.connection = mysql.createConnection({
            host     : config.database.mysql.host,
            user     : keys.database.mysql.user,
            password : keys.database.mysql.password,
            database : config.exchange
          });
    }
    connect(){
        this.connection.connect()
        return this.connection
    }
}

class Operations{
    constructor(config){
        this.connection = new Connection(config)
        this.connection = this.connection.connect()
        this.config = config
        this.candlesTable = new models.candlesTable(this.connection, this.config, this.getCandlesTableName())
        this.transactionTable = new models.transactionsTable(this.connection, this.config, this.getTransactionsTableName())
    }

    async init(){
        await this.candlesTable.init()
        await this.transactionTable.init()
    }

    getCandlesTableName(){
        var algorithm = this.config.algorithm
        return this.config.conversion + "_" + this.config.algoConfig[algorithm].data.timeFrame
                + "_" +"candles" //config.algoConfig[algorithm].data.type
    }

    getTransactionsTableName(){
        var algorithm = this.config.algorithm
        return this.config.conversion + "_transaction"
                + ((this.config.simulation) ? "_simulation" : "")
    }

    terminate(){
        this.connection.end()
    }



}

module.exports = Operations