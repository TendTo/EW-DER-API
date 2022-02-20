// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract MeteredReadingsNotary {
    event NewMeterReading(address indexed operator, bytes32 indexed proof);

    function store(bytes32 proof) public {
        emit NewMeterReading(msg.sender, proof);
    }
}
