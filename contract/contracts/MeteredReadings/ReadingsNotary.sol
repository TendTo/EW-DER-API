// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract ReadingsNotary {
    /** A new metered reading has been emitted */
    event NewMeterReading(address indexed operator, bytes indexed proof);

    /** Store a new reding
     * @param _proof Merkel root of the tree of merkle proofs of the aggregated readings
     */
    function store(bytes calldata _proof) external {
        emit NewMeterReading(msg.sender, _proof);
    }
}
