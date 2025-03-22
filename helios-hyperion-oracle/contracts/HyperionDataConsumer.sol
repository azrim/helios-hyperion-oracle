// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHyperionPrecompile {
    function requestData(
        uint64 chainId,
        address source,
        bytes calldata abiCall,
        bytes4 callbackSelector,
        uint256 maxCallbackGas,
        uint256 bridgeFee
    ) external payable returns (bytes32);
}

contract HyperionDataConsumer {
    address public constant hyperion = 0x0000000000000000000000000000000000000900;

    event TaskCreated(bytes32 indexed taskId);

    function fetchETHPrice() external payable {
        address source = address(0x1234567890123456789012345678901234567890); // example
        bytes memory abiCall = abi.encodeWithSignature("getPrice()");
        bytes4 callbackSelector = this.onETHPriceReceived.selector;

        bytes32 taskId = IHyperionPrecompile(hyperion).requestData{value: msg.value}(
            1, source, abiCall, callbackSelector, 300000, 1000000000000000000 // 1 HLS
        );

        emit TaskCreated(taskId);
    }

    function onETHPriceReceived(bytes32 taskId, bytes calldata value, bool error) external {
        require(msg.sender == hyperion, "Only Hyperion can call");
        if (!error) {
            uint256 price = abi.decode(value, (uint256));
            // do something with price
        }
    }
}
