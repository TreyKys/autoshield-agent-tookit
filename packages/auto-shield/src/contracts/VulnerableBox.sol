// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBox {
    address public implementation;
    address public owner;

    event Upgraded(address indexed implementation);

    constructor() {
        owner = msg.sender;
    }

    function upgradeTo(address newImplementation) external {
        // Simple update logic for demo purposes.
        // Real proxies would use assembly delegatecall checks.
        implementation = newImplementation;
        emit Upgraded(newImplementation);
    }

    // The "Bug"
    function withdraw() external {
        // Unsafe external call
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    receive() external payable {}
}
