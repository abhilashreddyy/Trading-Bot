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








// // const config = require("./config/config")
// // const exchangeQuery = require(`./data`)[config.exchange];
// // exchangeObj = exchangeQuery.init()

// // async function temp(){
// //     time = await exchangeObj.futuresTime()
// //     console.log(time)
// // }

var i = 1
var j = 1

const thePromise = new Promise((resolve, reject) => {
  if(i == 1){
    reject("rejected 1")
  }
  else{
    resolve({
      doSomething: function() {
        return new Promise((resolve, reject) => {
          if(j == 1){
            reject('rejected 2') //you can pass any value
          }
          else{
            resolve("resolved 2")
          }
          
        })
      }
    })
  }
  
})

thePromise
  .then(response => { 
    return response.doSomething()
  })
  .catch(error =>{
    console.log(error + " add 1")
  })
  .then(response => { 
    console.log("res :",response)
  })
  .catch(error => {
    console.log(error + " add 2")
  })