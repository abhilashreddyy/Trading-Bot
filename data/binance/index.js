const Binance = require('node-binance-api');
const config = require("../../config/config.json");
const keys = require("../../config/keys.json").binance;
const Queries = require("./queries");

const createData = () => {
    const binance = new Binance().options({
        APIKEY: keys.apiKey,
        APISECRET: keys.secretKey
    });
    const queries = new Queries(binance, config);
    return {
        exchange: binance,
        queries
    };
}

module.exports = createData