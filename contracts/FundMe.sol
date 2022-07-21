// SPDX-License-Identifier: MIT
// Best Practices in Solidity

// 1. License Identifier

// 2. Solidity Version
pragma solidity ^0.8.8;

// 3. Imports locally using yarn add --dev @chainlink/contracts
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// 4. Custom Errors
error FundMe__NotOwner();

// 5. Interfaces, Libraries and Contracts

/** NatSpec
 *  @title A Contract for Cowdfunding
 *  @author Umoja Software Labs
 *  @notice This contact is to demo a sample funding contract
 *  @dev   This implements PriceFeed as a library

 NatSpec can be used to automatically output user 
 documentation by running solc  --userdoc --devdoc example.sol
 in the terminal.
 */

contract FundMe {
    // 1. Type Declarations
    using PriceConverter for uint256;

    // 2. State Variables
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;

    // 3. Events

    // 4. Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    /* 5. Functions
       Function Order:
       1. constructor
       2. receive
       3. fallback
       4. external
       5. public
       6. internal
       7. private
       8. view / pure
    */

    // Parameterizing priceFeedAddress
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     *  @notice This function funds this contract
     *  @dev   This implements PriceFeed as a library
     */

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough ETH"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
}
