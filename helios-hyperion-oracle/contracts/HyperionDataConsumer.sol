// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHyperionPrecompile {
    function requestData(
        uint64 chainId,
        address source,
        bytes calldata abiCall,
        bytes4 callbackSelector,
        uint256 maxCallbackGas,
        uint256 gasLimit
    ) external payable returns (uint256);
}

contract HyperionDataConsumer {
    address public constant hyperion = 0x0000000000000000000000000000000000000900;

    event TaskCreated(uint256 indexed taskId);

    function fetchETHPrice() external payable {
        address source = address(0x1234567890123456789012345678901234567890); // example ETH contract to call
        bytes memory abiCall = abi.encodeWithSignature("getPrice()"); // example ETH function to call on the source contract
        bytes4 callbackSelector = this.onETHPriceReceived.selector;

        /*
        ** you can also do to avoid linking IHyperionPrecompile on all your contracts
               (bool success, bytes memory result) = hyperion.call{value: msg.value}(
            abi.encodeWithSignature(
                "requestData(uint64,address,bytes,bytes4,uint256,uint256)", 
                uint64(1), // eth chain id
                source, 
                abiCall, 
                callbackSelector, 
                uint256(300000), 
                uint256(1000000000000000000)
            )
        );
        */

        uint256 taskId = IHyperionPrecompile(hyperion).requestData{value: msg.value}(
            uint64(1),              // chainId
            source,                 // source address
            abiCall,                // encoded function call
            callbackSelector,       // callback function selector
            10 gwei,                // max gas price for callback
            300000                  // max gas limit for call
        );
        // max gas price x max gas limit for call
        // 10 x 300,000  = 3,000,000
        // we are willing to pay 0.003 HLS max for the callback execution based on the msg.value we sent
        // so if network is too overloaded the cron will wait until auto expiration and refund msg.value

        emit TaskCreated(taskId);
    }

    // hyperion oracle will call us here giving us the price return from the ETH contract getPrice() call
    function onETHPriceReceived(bytes memory data, bytes memory err) external {
        require(msg.sender == hyperion, "Only Hyperion can call");
        if (err.length == 0) {
            // cast as the received info from the eth contract is in uint256
            uint256 price = abi.decode(data, (uint256));
            // do something with price
        }
    }
}
