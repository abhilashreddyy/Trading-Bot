// class Trader{
//     constructor(exchange, base, token, tokenPrice){
//         this.exchange = exchange;
//         this.base = base;
//         this.token = token;
//         this.initialMoney = base + tokenPrice * token;
//     }

//     trade(action, price, fraction){
        
//         if(tradeObj.action == "buy" && this.currency1 > 0){
//             this.currency2 = this.convertC1ToC2(this.currency1, tradeObj.price, tradeObj.fraction)
//             this.currency1 = (1-tradeObj.fraction)*this.currency1
//             tradeObj["currency1"] = this.currency1
//             tradeObj["currency2"] = this.currency2
//             this.ledger.push(tradeObj)
//             // console.log("profit : ",this.totalProfit)
//         }
//         else if(tradeObj.action == "sell" && this.currency2 > 0){
//             this.currency1 = this.convertC2ToC1(this.currency2, tradeObj.price, tradeObj.fraction)
//             this.currency2 = (1-tradeObj.fraction)*this.currency2
//             this.totalProfit = this.currency1 - this.initialMoney
//             tradeObj["currency1"] = this.currency1
//             tradeObj["currency2"] = this.currency2
//             tradeObj["profit"] = this.currency1 + this.convertC2ToC1(this.currenct2, tradeObj.price,1) - this.lastSellCurrency1()
//             this.ledger.push(tradeObj)
//             // console.log("profit : ",this.totalProfit)
//         }
//         else if(tradeObj.action = "observe"){
//             // console.log("Just Observing !!")
//         }
//         else{
//             // console.log("Either you dont have money to buy or money to sell check account !!!")
//         }

//     }

//     convertC1ToC2(currency1, c2Price, fraction){
//         return (currency1*fraction)/c2Price
//     }

//     convertC2ToC1(currency2, c2Price, fraction){
//         return currency2*fraction*c2Price
//     }

//     lastSellCurrency1(){
//         for(let i = this.ledger.length-1; i >= 0; i--){
//             if(this.ledger[i].action == "sell"){
//                 return this.ledger[i].currency1+this.convertC2ToC1(this.ledger[i].currency2, this.ledger[i].currency2.price ,1)
//             }
//         }
//         return this.initialMoney
//     }


// }

// module.exports = Trader
