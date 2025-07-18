const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} HLS`);

  const HyperionDataConsumer = await ethers.getContractFactory("HyperionDataConsumer");
  const contract = await HyperionDataConsumer.deploy();
  await contract.deploymentTransaction(); 
  
  console.log(`HyperionDataConsumer deployed to: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});