# Cross-Chain Data Request Smart Contract for Helios with Hyperion

## Overview

`HyperionDataConsumer.sol` is a reference smart contract built for the Helios blockchain, showcasing how to interact with the Hyperion precompile system. It allows smart contracts to request external data from other blockchains (like Ethereum) in a decentralized, asynchronous, and secure way.

This contract does not fetch the data itself — it delegates the task to the Helios Hyperion network, a decentralized oracle and relayer module.

---

Hyperion is a network of modules and nodes on Helios that:
- Monitor smart contract requests for external data.
- Fetch the requested data from other chains via RPC or light clients.
- Sign and return the result to Helios.
- Trigger smart contract callbacks to deliver the data.

It functions similarly to Chainlink, but is natively integrated in the Helios stack leveraging Chronos schedules to trigger the callback execution.

---

This contract demonstrates how to:
1. Request a piece of external data (e.g. ETH price from Uniswap on Ethereum).
2. Pay the required fees upfront (Hyperion oracle fee + gas evm reserve).
3. Specify a callback function that will be called once the data is received and validated by the Hyperion network.

---

## Fee Mechanism for Cross-Chain Requests

When you call `fetchETHPrice()` (or any external data request), your transaction sends a `msg.value` that is used to fund:

- Hyperion fee (50%): pays the nodes fetching data from the external chain (e.g., Ethereum).
- Callback execution fee (50%): pays for the EVM gas to execute the callback on Helios when data is ready.

Example:
- You want to allow up to 300,000 gas for the callback.
- At 10 gwei gas price, the callback may cost up to `0.003 HELIOS`.
- You send `0.006 HELIOS` in total — the system splits and reserves both sides.

If not enough gas is used, the remaining value is refunded after execution or expiration.

---

## ⚙️ How It Works

### 1. `fetchETHPrice()` — Initiates a Data Request

```solidity
function fetchETHPrice() external payable;
```

- Encodes an ABI call to a known contract on another chain (e.g. a price feed).
- Sends the request to a precompile address (0x999...).
- Pays `msg.value` to cover:
  - `hyperionFee`: paid to Hyperion nodes to execute the request off-chain.
  - `maxCallbackGas`: reserved to execute the callback once the result is available.

### 2. `requestData(...)` — Precompile Logic

The call is routed through a precompile contract integrated with the module `Hyperion Oracle`. This module stores:
- The chain and target contract info.
- The ABI of the function to be called.
- The address and selector for the callback.
- The total funds provided for execution.

It then exposes the request to Hyperion-enabled nodes for processing.

### 3. `onETHPriceReceived(...)` — Callback Upon Resolution

```solidity
function onETHPriceReceived(bytes memory data, bytes memory err) external;
```

- This function is automatically called by the Oracle module when a consensus of Hyperion nodes return the data.
- The result (e.g. ETH price) is passed in `value`, ABI-encoded.
- If `error == true`, the request failed or timed out.

---

## Why Pay Upfront?

Because Helios offloads the task to decentralized modules, the smart contract must provide:

| Fee Component   | Purpose                                                      |
|-----------------|--------------------------------------------------------------|
| `bridgeFee`     | To pay Hyperion nodes for calling external chain             |
| `maxCallbackGas`| To ensure the callback function can be executed on Helios    |

If not enough is paid, the request will fail, and Hyperions will not process it.

---

## How to Use in a Project

1. Deploy your contract inheriting the same `fetch + callback` pattern.
2. Call `fetchETHPrice()` with enough HELIOS to cover execution costs.
3. Use the `onXXXReceived(...)` function to process and act on the returned data.

---

## Example Use Cases

- Cross-chain oracles: e.g., fetch token prices from Ethereum or Binance Smart Chain.
- Interchain governance triggers.
- Time-delayed smart contract automation based on data from external chains.
- Secure decentralized off-chain computation results.

---

## To Go Further

- Plug this contract into your dApp on Helios.
- Extend the logic to dynamically change the target chain or function to call.
- Use the `taskId` to track the status of async data fetches off-chain.

For any integration questions, join the official Discord server.


---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the contract

```bash
npx hardhat compile
```

### 3. Set up your `.env` file

Create a `.env` file at the root of the project and insert your private key (without the `0x`):

```env
PRIVATE_KEY=your_private_key_here
```

### 4. Deploy the contract

You can deploy the contract to the Helios local network or testnet.

#### Deploy to localhost (Helios node running on localhost:8545)

```bash
npx hardhat run scripts/deploy.js --network helios-testnet
```

#### Deploy to Helios public testnet

```bash
npx hardhat run scripts/deploy.js --network helios-testnet
```

Make sure your account has enough HELIOS for gas and fees.

#### Execution of the function call to retrieve data from the Ethereum chain (chain id 0x1)

```bash
npx hardhat run scripts/callFetchETHPrice.js --network helios-testnet
```

---
