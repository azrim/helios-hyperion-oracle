const hre = require("hardhat");
const { ethers } = hre;

const CONTRACT_ADDRESS = "0xe2a522bF5987B884Eb8Ec2D144E7Eca8ABda6B10";
const TOTAL_CALL_VALUE = ethers.parseEther("0.1"); // e.g. 5 for bridgeFee + 5 for maxGas

async function main() {
  const [caller] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(caller.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} HLS`);
  console.log(`Calling fetchETHPrice() from: ${caller.address}`);

  const contract = await ethers.getContractAt("HyperionDataConsumer", CONTRACT_ADDRESS);

  const tx = await contract.fetchETHPrice({
    value: TOTAL_CALL_VALUE, // -> we are willing to pay hyperion / evm execution up to TOTAL_CALL_VALUE HLS to fetch the data on ethereum chain
                            // rest not consumed is refunded: it is splitted 50% for hyperion external calls / 50% for evm executions
    gasLimit: 500000, // this is only gas limit for current execution, asking the external data to be requested
  });

  console.log("Transaction sent. Waiting for confirmation...");
  const receipt = await tx.wait();

  const event = receipt.logs.find(log =>
    log.topics[0] === contract.interface.getEvent("TaskCreated").topicHash
  );

 if (event) {
    // Create an interface for decoding
    const iface = new ethers.Interface([
      "event TaskCreated(uint256 indexed taskId)"
    ]);
    
    // Parse the log using the interface
    const parsedLog = iface.parseLog({
      topics: event.topics,
      data: event.data
    });
    
    // Access the decoded taskId
    const taskId = parsedLog.args.taskId;
    console.log(`Task created with ID: ${taskId}`);
  } else {
    console.log("TaskCreated event not found. Check contract or network status.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
