# General Programming
```
Refactoring = Going back and changing how code works
```
# Smart Contract Best Practices
```
Properly Structuring a Smart Contract

Setup
1. SPDX License
2. Pragma Version
3. Import Statements
4. Libraries
5. Contracts

Use the following order inside of a contract:

1. Type Declarations
2. State Variables
3. Events
4. Modifiers
5. Functions


Always declare a visibility for variables in Solidity

Errors
Error names should start with name of the contracts they're contained in.

EXAMPLE:
error FundMe__NotOwner();

Mocks
Mocks are scripts used to test objects
If the contract doesnt exist then deploy a minimal version for local testing using mocks.

Mocks are generally unneccesary on mainnets like Ethereum?
```

# Efficient Project Structure
```
Create a test directory in root
Create a staging subdirectory in /test
Create another subdirectory named unit in /test
```
# Good Testing Technique
```
Unit Testing
Test small parts of the code locally
Can be done on:
- local hardhat
- forked hardhat

Staging Testing
Last stop before deployment testing done on a testnet
```

# Hardhat Tips
```
Use the yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
syntax to ovveride regular hardhat ethers and give ethers the ability to keep track of remember all of the deployments in a contract

"@nomiclabs/hardhat-ethers": "npm:hardhat-deploy-ethers",
signifies that @nomiclabs/hardhat-ethers is being overridden by npm:hardhat-deploy-ethers.
```

# Javascript Tips

# Solidity Tips
```
BigNumbers are objects
```

# Ethers
```
Syntax
ethers.utils.parseEther("1234567890") can be used to pass ether values in a simplified manners. ("1") = 1 ETH

ethers.utils.ParseUnits("1234567890") can be  used to convert ETH units(WEI, GWEI, etc). 
```