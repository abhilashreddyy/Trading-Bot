const keys = require("./config/keys.json");
const config = require("./config/config.json");
const mysql = require("mysql")

var dbops = require("./dbs").mysqlOps

dbops = new dbops(config)

this.connection = mysql.createConnection({
  host     : config.database.mysql.host,
  user     : keys.database.mysql.user,
  password : keys.database.mysql.password,
  database : config.exchange
});

var temp = {
  "start" : 0,
  "end" : 1234100022
}

this.connection.query("select * from ETHUSDT_15m_candles where time >= 1622250900000 and time <= 1623060900000 order by time asc",(error, results, fields)=>{
  if(error) throw error
  // console.log("results : ",results, fields)
  // console.log(dbops.candlesTable.getTimeRangeGaps(results, temp))
})

