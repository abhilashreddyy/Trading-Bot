const config = require("../../config/config.json");
const keys = require("../../config/keys.json");
const Queries = require("./queries");

const createData = () => {
    const createData = require(`../${config.exchange}`);
    const { exchange, queries } = createData();
    const simulationQueries = new Queries(queries, config);
    
    return {
        exchange,
        queries: simulationQueries
    };
}

module.exports = createData;