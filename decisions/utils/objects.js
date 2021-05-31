class TransactionHistory{
    constructor(transactionObjList = null){
        if(TransactionHistory != null){
            this.transactionHistory = transactionObjList
        }
        else{
            this.transactionHistory = []
        }
    }

    add(type, time, value){
        this.transactionHistory.push(new Transaction(type, time, value))
    }
    
}


class Transaction{
    constructor(type = null, value = null, time = null){
        this.type = type 
        this.value = value
        this.time = time
    }

    update(type, time, value){
        this.time = time
        this.value = value
        this.type = type
    }
    
}

module.exports = TransactionHistory
module.exports = Transaction