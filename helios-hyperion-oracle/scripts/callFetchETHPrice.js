const hre = require("hardhat");
const { ethers } = hre;

const CONTRACT_ADDRESS = "0x503A9C7C0c2D0b55AC4E79d990abb9be6C7e438E";
const TOTAL_CALL_VALUE = ethers.parseEther("0.02"); // e.g. 0.01 for bridgeFee + 0.01 for maxGas

async function main() {
  const [caller] = await ethers.getSigners();
  console.log(`Calling fetchETHPrice() from: ${caller.address}`);

  const contract = await ethers.getContractAt("HyperionDataConsumer", CONTRACT_ADDRESS);

  const tx = await contract.fetchETHPrice({
    value: TOTAL_CALL_VALUE
  });

  console.log("Transaction sent. Waiting for confirmation...");
  const receipt = await tx.wait();

  const event = receipt.logs.find(log =>
    log.topics[0] === contract.interface.getEvent("TaskCreated").topicHash
  );

  if (event) {
    const taskId = ethers.decodeLog(["bytes32"], event.data)[0];
    console.log(`✅ Task created with ID: ${taskId}`);
  } else {
    console.log("⚠️ TaskCreated event not found. Check contract or network status.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
