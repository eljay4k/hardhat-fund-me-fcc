const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    // Don't forget to ensure to run test on the same network as MockV3Aggregator locally
    let mockV3Aggregator
    // Uses ethers.utils.parseEther to create a const with an Ether value of 1
    const sendValue = ethers.utils.parseEther("1")

    //Deploys FundMe contract inside test
    beforeEach(async function () {
        /** Deploying contract with hardhat-deploy. 
   Comes with benefit of delivering FundMe contract with our mocks 
   @dev Tells this script which account you'd like connected to FundMe
   and abstracts just the deployer from getNamedAccounts.
   ALTERNATE SYNTAX:
   ethers.getSigners
   const accounts = ethers.getSigners()
   const accountZero = accounts[0]
   */
        deployer = (await getNamedAccounts()).deployer

        /** 
    * @dev Uses the fixture function from deployments to run through
   all scripts with "all" tag in just one line*/
        await deployments.fixture(["all"])

        /**
    * @dev Uses hardhat-deploy's wrapped version ethers to provide
   getContract function to grab the most recently deployed
   version of any given contract 
    */
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    // Grouping tests around a particular function
    describe("constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    // Uses waffle to use .to.be.reverted or .to.be.revertedWith syntax
    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough ETH"
            )
        })
        it("Updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            // Gets response (a BigNumber) and sendValue and compares them as strings
            assert.equal(response.toString(), sendValue.toString())
            console.log(sendValue.toString())
        })
        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })
        // Arrange / Act / Assert Tests
        it("Withdraw ETH from a single founder", async function () {
            // Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = await transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
