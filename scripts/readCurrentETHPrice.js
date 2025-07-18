const hre = require("hardhat");
const { ethers } = hre;
const fs = require("fs");

const { contractAddress } = JSON.parse(fs.readFileSync("deployed-address.json", "utf8"));
if (!contractAddress) {
  console.error("Contract address not found. Please deploy first.");
  process.exit(1);
}

async function main() {
  const [caller] = await ethers.getSigners();

  const contract = await ethers.getContractAt("HyperionDataConsumer", contractAddress);

  const ethPrice = await contract.getCurrentETHPrice();

  console.log(`Current stored ETH Price in the Helios contract: ${ethPrice.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
