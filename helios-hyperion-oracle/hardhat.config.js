require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 4242,
    },
    helios: {
      url: "http://localhost:8545",
      chainId: 4242,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    "helios-testnet": {
      url: "http://testnet1.helioschainlabs.org:8545/",
      chainId: 4242,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};
