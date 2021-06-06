
ledger = []

class Trader{
    constructor(currency1 = 0, currency2 = 1, conversion = 0){
        console.log("conversion : ", conversion)
        this.currency1 = currency1
        this.currency2 = currency2
        this.initialMoney = currency1 + conversion * currency2
        this.ledger = []
        this.totalProfit = 0
        this.firstSell = 0
    }

    trade(tradeObj){
        
        if(tradeObj.action == "buy" && this.currency1 > 0){
            tradeObj["currency1BeforeTrade"] = this.currency1
            tradeObj["currency2BeforeTrade"] = this.currency2
            this.currency2 = this.convertC1ToC2(this.currency1, tradeObj.price, tradeObj.fraction)
            this.currency1 = (1-tradeObj.fraction)*this.currency1
            tradeObj["currency1AfterTrade"] = this.currency1
            tradeObj["currency2AfterTrade"] = this.currency2
            this.ledger.push(tradeObj)
            console.log("profit : ",this.totalProfit)
        }
        else if(tradeObj.action == "buy skip"){
            tradeObj["currency1BeforeTrade"] = this.currency1
            tradeObj["currency2BeforeTrade"] = this.currency2
            tradeObj["currency1AfterTrade"] = this.currency1
            tradeObj["currency2AfterTrade"] = this.currency2
            this.ledger.push(tradeObj)
        }
        else if(tradeObj.action == "sell skip"){
            tradeObj["currency1BeforeTrade"] = this.currency1
            tradeObj["currency2BeforeTrade"] = this.currency2
            tradeObj["currency1AfterTrade"] = this.currency1
            tradeObj["currency2AfterTrade"] = this.currency2
            this.ledger.push(tradeObj)
        }
        else if(tradeObj.action == "sell" && this.currency2 > 0){
            console.log(this.currency1 ,this.initialMoney)
            tradeObj["currency1BeforeTrade"] = this.currency1
            tradeObj["currency2BeforeTrade"] = this.currency2
            this.currency1 = this.convertC2ToC1(this.currency2, tradeObj.price, tradeObj.fraction)
            this.currency2 = (1-tradeObj.fraction)*this.currency2
            this.totalProfit = this.currency1 - this.initialMoney
            tradeObj["currency1AfterTrade"] = this.currency1
            tradeObj["currency2AfterTrade"] = this.currency2
            tradeObj["profit"] = this.currency1 + this.convertC2ToC1(this.currency2, tradeObj.price,1) - this.lastSellCurrency1()
            this.ledger.push(tradeObj)
            console.log("profit : ",this.totalProfit)

            this.firstSell = 1
        }
        else if(tradeObj.action = "observe"){
            console.log("Just Observing !!")
        }
        else{
            console.log("Either you dont have money to buy or money to sell check account !!!")
        }
        console.log("total profit till now : ",this.totalProfit)

    }

    convertC1ToC2(currency1, c2Price, fraction){
        return (currency1*fraction)/c2Price
    }

    convertC2ToC1(currency2, c2Price, fraction){
        return currency2*fraction*c2Price
    }

    lastSellCurrency1(){
        for(let i = this.ledger.length-1; i >= 0; i--){
            if(this.ledger[i].action == "sell"){
                return this.ledger[i].currency1AfterTrade+this.convertC2ToC1(this.ledger[i].currency2AfterTrade, this.ledger[i].price ,1)
            }
        }
        return this.initialMoney
    }


}

module.exports = Trader
