// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GreenCredit
 * @dev ERC-20 token for rewarding community actions.
 * Ownership will be transferred to the CleanupDAO contract upon deployment.
 */
contract GreenCredit is ERC20, Ownable {
    constructor(address initialOwner) ERC20("GreenCredit", "GRC") Ownable(initialOwner) {
        // The deployer (you) is the initial owner.
        // We will transfer ownership to the DAO in the deploy script.
    }

    /**
     * @dev Creates `amount` tokens and assigns them to `account`.
     * Can only be called by the owner (CleanupDAO).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}