
const connection = require("../connection")


class Operations{
    constructor(self, creds, config){
        this.connection = new connection.Connection(creds, config)
        this.connection = this.connection.connect()
    }

    

    



}