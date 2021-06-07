const binance = require("./binance");
const simulation = require("./simulation");
const config = require("../config/config");



const data = {
    binance,
    simulation
};

class Data {
    constructor(exchangeName, isSimulation, mysqlOps) {
        this.mysqlOps = mysqlOps
        if(isSimulation) {
            exchangeName = "simulation";
        }
        const createdDataInstance = data[exchangeName](this.mysqlOps);
        this.exchange = createdDataInstance.exchange;
        this.queries = createdDataInstance.queries;
    }

    async initialFetch() {
        return (await this.queries.initialFetch());
    }

    async getCandles(pair, candleSize, noOfCandles) {
        return (await this.queries.getCandles(pair, candleSize, noOfCandles));
    }

    async getPrice(pair) {
        return (await this.queries.getPrice(pair));
    }

    async getTime() {
        return (await this.queries.getTime());
    }
}

module.exports = Data;