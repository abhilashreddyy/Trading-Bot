const config = require("../../config/config.json");
const keys = require("../../config/keys.json");
const Queries = require("./queries");


const createData = (mysqlOps) => {
    const createData = require(`../${config.exchange}`);
    const { exchange, queries } = createData(mysqlOps);
    const simulationQueries = new Queries(queries, mysqlOps, config);
    
    return {
        exchange,
        queries: simulationQueries
    };
}

module.exports = createData;