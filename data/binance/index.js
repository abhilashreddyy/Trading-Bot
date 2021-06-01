const Binance = require('node-binance-api');
const keys = require("../../config/keys.json").binance;
const Queries = require("./queries");

const init = () => {
    const binance = new Binance().options({
        APIKEY: keys.apiKey,
        APISECRET: keys.secretKey
    });
    return binance;
}

module.exports = {
    init,
    Queries
}