/* Longform Syntax
function deployFunc(hre) {
    console.log("Hi!")
}
// Exports function as the default Hardhat function
module.exports.default = deployFunc
*/

// Anonymous Async Function Syntax
// module.exports = async (hre) => {
//     const {getNamedAccounts} = hre
// } is the same as
// hre.getNamedAccounts()
// hre.deployments

/* This syntax:
const helperConfig = require("../helper-hardhat-config")
const networkConfig = helperConfig.networkConfig
accomplishes the same as the line of code below */
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { getNamedAccounts } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    /* Dynamically setting ethPriceFeed address
   if chainId is X, use address Y
   if chainId is Z, use address A */
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    // CallsblockConfirmations: 6, deploy function
    const fundMe = await deploy("FundMe", {
        // Overrides
        from: deployer,
        args: args, //Insert price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("----------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
