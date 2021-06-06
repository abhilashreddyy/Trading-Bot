// this is an abstract class
class queryConstructor{

    constructor(columns, tableName){
        this.columns = columns
        this.tableName = tableName
        this.numColumns = this.getNumColumns()
    }

    getNumColumns(){
        var i = 0
        var column
        for(column in this.columns){
            i+=1
        }
        return i
    }
    creationQuery(){
        var query = `CREATE TABLE ${this.tableName} (`
        var column, i = 0
        for(column in this.columns){
            if(i < this.numColumns-1) query += `${column} ${this.columns[column]}, `
            else query += `${column} ${this.columns[column]}`
            i+=1
        }
        query += ")"
        return query
    }

    insertionQuery(newRows){
        var query = `INSERT INTO ${this.tableName} (`
        var column, i = 0
        for(column in this.columns){
            if(i < this.numColumns-1)query += `${column}, `
            else query += `${column}`
            i+=1
        }
        
        query += ') VALUES ?'


        var tuplesList = []
        for(let row of newRows){
            var tempTuple = []
            for(column in this.columns){
                try{
                    if(row[column] == null) throw(`column ${column} misssing in given input`)
                    tempTuple.push(row[column])
                }
                catch(err){
                    console.log("ERROR :",err)
                }
            }
            tuplesList.push(tempTuple)
            
        }

        return {
            "query" : query,
            "tupleList" : tuplesList
        }
    }
}


module.exports = {queryConstructor}
