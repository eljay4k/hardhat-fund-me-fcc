// Keeps track of different price feeds across chains
const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },

    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
    /* Telos 40: {
        name: "telos",
        ethUsdPriceFeed:""
    } */
    //31337:
}
// Declares local development chains into a variable
const developmentChains = ["hardhat", "localHost"]
// Declares an amount of decimal places for mock usage
const DECIMALS = 8
// Declares an initial price for MockV3Aggregator with 8 decimals
const INITIAL_ANSWER = 200000000000
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
