require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GAS_PRICE = process.env.GAS_PRICE || "1000000000"; // default 1 gwei

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 4242,
      gasPrice: Number(GAS_PRICE),
      gasLimit: 500000,
    },
    helios: {
      url: "http://localhost:8545",
      chainId: 4242,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: Number(GAS_PRICE),
      gasLimit: 500000,
    },
    "helios-testnet": {
      url: "http://testnet1.helioschainlabs.org:8545/",
      chainId: 4242,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: Number(GAS_PRICE),
      gasLimit: 500000,
    }
  }
};
