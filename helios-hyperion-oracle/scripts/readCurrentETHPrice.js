const hre = require("hardhat");
const { ethers } = hre;

const CONTRACT_ADDRESS = "0xe2a522bF5987B884Eb8Ec2D144E7Eca8ABda6B10";

async function main() {
  const [caller] = await ethers.getSigners();

  const contract = await ethers.getContractAt("HyperionDataConsumer", CONTRACT_ADDRESS);

  const ethPrice = await contract.getCurrentETHPrice();

  console.log(`Current stored ETH Price in the Helios contract: ${ethPrice.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
