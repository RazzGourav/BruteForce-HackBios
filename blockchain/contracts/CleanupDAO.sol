// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./GreenCredit.sol";

/**
 * @title CleanupDAO
 * @dev This contract is the community treasury.
 * It receives slashed ETH and is the owner of the GreenCredit token.
 * The Admin (your wallet) can withdraw ETH to fund projects and mint GRC for rewards.
 */
contract CleanupDAO {
    address public immutable admin;
    GreenCredit public immutable greenCreditToken;

    event FundsReceived(address from, uint amount);
    event FundsWithdrawn(address to, uint amount);
    event CreditsMinted(address to, uint amount);

    constructor(address _greenCreditTokenAddress) {
        admin = msg.sender; // The deployer is the admin
        greenCreditToken = GreenCredit(_greenCreditTokenAddress);
    }

    // --- Core Functions ---

    /**
     * @dev Receive ETH from the EcoStake contract.
     */
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    /**
     * @dev Admin withdraws ETH to fund cleanup projects.
     */
    function withdrawFunds(address payable to, uint amount) external {
        require(msg.sender == admin, "Only admin");
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(to, amount);
    }

    /**
     * @dev Admin mints GreenCredit tokens to reward community members.
     * This contract MUST be the owner of the GreenCredit token contract.
     */
    function rewardCommunity(address member, uint amount) external {
        require(msg.sender == admin, "Only admin");
        greenCreditToken.mint(member, amount);
        emit CreditsMinted(member, amount);
    }

    /**
     * @dev Admin function to send ETH back to EcoStake contract for a refund.
     */
    function approveRefund(address payable ecoStakeContract, uint amount) external {
        require(msg.sender == admin, "Only admin");
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = ecoStakeContract.call{value: amount}("");
        require(success, "Refund transfer failed");
    }

    // --- View Functions ---

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}