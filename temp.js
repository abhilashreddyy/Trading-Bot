const config = require("./config/config")
const keys = require("./config/keys")

const exchangeMain = require(`./data`)[config.exchange]
const simulationMain = require(`./data`)["simulation"]
var tradingDecision = require("./decisions")
var exchangeObj = exchangeMain.init()

var Model = require("./dbs/mysql/models")
var Operations = require("./dbs/mysql/dbOperations")

async function run1(operations, inp, i){
  try{
    await operations.candlesTable.addRow(inp)
    console.log(i)
  }
  catch(error){
    console.log(error)
  }
}

async function run(){
  var operations = new Operations(keys,config)
  await operations.init()

  var inp = [{
              "time" : 129812,
              "open" :  23.45, 
              "close" : 22.34, 
              "high" : 55.54, 
              "low" : 14.34, 
              "closeTime" : 1255,
              "volume" :  23456
            },
            {
              "time" : 23224,
              "open" :  23.45, 
              "close" : 22.34, 
              "high" : 55.54, 
              "low" : 14.34, 
              "closeTime" : 1255,
              "volume" :  23456
            },{
              "time" : 287562,
              "open" :  23.45, 
              "close" : 22.34, 
              "high" : 55.54, 
              "low" : 14.34, 
              "closeTime" : 1255,
              "volume" :  23456
            }]

  // inp = {
  //         "time" : 122342334,
  //         "open" :  23.45, 
  //         "close" : 22.34, 
  //         "high" : 55.54, 
  //         "low" : 14.34, 
  //         "closeTime" : 1255,
  //         "volume" :  23456
  //       }
  // inp = [[1234, 23.45,22.34,55.54, 14.34, 1255,23456]]
  // for(var i = 0; i < inp.length; i++){
  //   try{
  //     await model.addRow(inp[i])
  //     console.log(i)
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
  run1(operations,inp[0],0)
  run1(operations,inp[1],1)
  run1(operations,inp[2],2)




  console.log("hello");



}

run()










// const mysql = require("mysql")
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'abhi',
//     password : '@13961220@',
//     database : 'binance'
//   });

// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   console.log('connected as id ' + connection.threadId);
// });


// tableName = "tempTable"
// connection.query('SHOW tables', function (error, results, fields) {
//   if (error) throw error;
//   else{

//     console.log(results[0])
//     console.log(Object.getOwnPropertyNames(results[0]))
//     if(results.some(val => val["Tables_in_binance"] == tableName)){
//       console.log("found")
//     }
//     else{
//       console.log("not found")
//       connection.query("CREATE TABLE ?? (time int, open float, close float, high float, low float, closeTime int unsigned, volume float)", tableName, function(error, results, fields){
//         if (error){
//           console.log("error", error)
//         }
//         console.log("table created : ",results)
//         // connection.end()
//       })
//     }
//     // for(table of tables){

//     // }
//   }
//   // connected!
// });








// const config = require("./config/config")
// const exchangeQuery = require(`./data`)[config.exchange];
// exchangeObj = exchangeQuery.init()

// async function temp(){
//     time = await exchangeObj.futuresTime()
//     console.log(time)
// }

// var i = 1
// var j = 1

// const thePromise = new Promise((resolve, reject) => {
//   if(i == 1){
//     reject("rejected 1")
//   }
//   else{
//     resolve({
//       doSomething: function() {
//         return new Promise((resolve, reject) => {
//           if(j == 1){
//             reject('rejected 2') //you can pass any value
//           }
//           else{
//             resolve("resolved 2")
//           }
          
//         })
//       }
//     })
//   }
  
// })

// thePromise
//   .then(response => { 
//     return response.doSomething()
//   })
//   .catch(error =>{
//     console.log(error + " add 1")
//   })
//   .then(response => { 
//     console.log("res :",response)
//   })
//   .catch(error => {
//     console.log(error + " add 2")
//   })