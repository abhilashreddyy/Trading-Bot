class Connection{
    constructor(keys, config){
        this.connection = mysql.createConnection({
            host     : this.config.database.mysql.host,
            user     : this.keys.database.mysql.user,
            password : this.keys.database.mysql.password,
            database : this.config.exchange
          });
    }
    connect(){
        return this.connection.connect()
    }
}

module.exports = Connection