// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IQIEOracle {
    // Standard interface for QIE Native Price Feeds
    function getLatestPrice(string memory symbol) external view returns (int256);
}
