# Helios Hyperion Oracle Tutorial: Fetching Cross-Chain Data

This tutorial guides you through deploying and interacting with the `HyperionDataConsumer` smart contract on the Helios network. You will learn how to request data from an external blockchain (like Ethereum) and retrieve it in your Helios smart contract.

This project has been improved to fix a critical bug and enhance usability, making it an ideal starting point for your own cross-chain applications.

## Prerequisites

- **Node.js & npm:** [Install Node.js](https://nodejs.org/) (v18 or higher).
- **Git:** [Install Git](https://git-scm.com/downloads).
- **Helios Testnet Wallet:** An account on the Helios testnet with some `HLS` tokens for gas fees. You can get testnet `HLS` from the official faucet.

## Step 1: Set Up Your Project

First, clone the repository and install the required dependencies.

```bash
git clone <your-repo-url>
cd helios-hyperion-oracle
npm install
```

Next, create a `.env` file in the project root to store your private key. This key is needed to deploy the contract and send transactions.

```env
# .env
PRIVATE_KEY=your_private_key_without_0x
```

**Security Note:** Never commit your `.env` file or expose your private key publicly.

## Step 2: Compile the Smart Contract

Compile the `HyperionDataConsumer.sol` contract to ensure everything is set up correctly.

```bash
npx hardhat compile
```

This command generates the ABI and bytecode necessary for deployment.

## Step 3: Deploy to Helios Testnet

Now, deploy the contract to the Helios testnet. The deployment script has been improved to automatically save the contract address for you.

```bash
npx hardhat run scripts/deploy.js --network helios-testnet
```

After a successful deployment, you will see output like this:

```
Deploying with account: 0xYourWalletAddress...
Account balance: 100.0 HLS
HyperionDataConsumer deployed to: 0x...
```

The script will also create a `deployed-address.json` file containing the new contract address.

## Step 4: Request External Data

With the contract deployed, you can now request the ETH price from the (simulated) Ethereum network. The `callFetchETHPrice.js` script reads the contract address from `deployed-address.json` and initiates the request.

```bash
npx hardhat run scripts/callFetchETHPrice.js --network helios-testnet
```

This script calls the `fetchETHPrice()` function, which sends a request to the Hyperion oracle network. The transaction pays a fee to cover both the external data fetch and the subsequent callback execution on Helios.

You will see a `TaskCreated` event with a unique ID for your request:

```
Account balance: 99.9 HLS
Calling fetchETHPrice() from: 0xYourWalletAddress...
Transaction sent. Waiting for confirmation...
Task created with ID: 12345
```

## Step 5: Retrieve the Stored Data

The Hyperion network takes a moment to fetch the data and call the `onETHPriceReceived` callback function in your contract. Once the callback is executed, the ETH price is stored in the `ethPrice` state variable.

You can read this stored value using the `readCurrentETHPrice.js` script.

```bash
npx hardhat run scripts/readCurrentETHPrice.js --network helios-testnet
```

The output will show the retrieved price:

```
Current stored ETH Price in the Helios contract: 2500
```

If the price is `0`, it means the callback has not been executed yet. Wait a few moments and try again.

## Conclusion

Congratulations! You have successfully deployed a smart contract that fetches cross-chain data using the Helios Hyperion oracle. You can now adapt this example for your own use cases, such as:

- Fetching token prices from other DEXs.
- Triggering actions based on events on other chains.
- Building cross-chain governance systems.

This corrected and improved example provides a solid foundation for building powerful dApps on Helios.
