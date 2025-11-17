// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EcoStake
 * @dev Factories stake their eco-bond here.
 * The Admin (as the hackathon oracle) can slash the bond.
 */
contract EcoStake {
    address public immutable admin;
    address public immutable cleanupDAO; // The address of your CleanupDAO contract

    // Mapping from a factory's wallet address to their staked amount
    mapping(address => uint) public factoryStakes;
    // Mapping from a factory's wallet address to their registered license ID
    mapping(address => string) public factoryLicenses;

    // --- Events ---
    event Staked(address indexed factory, string licenseId, uint amount);
    event Slashed(address indexed factory, uint amount, uint remainingStake);
    event ClaimSettled(address indexed factory, uint refundAmount);
    event Withdrawn(address indexed factory, uint amount);

    constructor(address _cleanupDAOAddress) {
        admin = msg.sender; // The deployer is the admin
        cleanupDAO = _cleanupDAOAddress;
    }

    // --- Core Functions ---

    /**
     * @dev Factory registers with their license and stakes their bond.
     */
    function registerAndStake(string memory licenseId) external payable {
        require(msg.value > 0, "Stake must be > 0");
        require(bytes(factoryLicenses[msg.sender]).length == 0, "Already registered");

        factoryStakes[msg.sender] += msg.value;
        factoryLicenses[msg.sender] = licenseId;
        
        emit Staked(msg.sender, licenseId, msg.value);
    }

    /**
     * @dev Renews or tops up an existing bond.
     */
    function topUpStake() external payable {
        require(msg.value > 0, "Top-up must be > 0");
        require(bytes(factoryLicenses[msg.sender]).length > 0, "Not registered");

        factoryStakes[msg.sender] += msg.value;
        emit Staked(msg.sender, factoryLicenses[msg.sender], msg.value);
    }

    /**
     * @dev The CORE function. Called by the Admin (as the oracle)
     * to slash a factory's bond.
     */
    function slash(address factory, uint slashAmount) external {
        require(msg.sender == admin, "Only admin (oracle)");
        
        uint currentStake = factoryStakes[factory];
        require(currentStake >= slashAmount, "Insufficient stake");

        // 1. Reduce the factory's stake
        factoryStakes[factory] = currentStake - slashAmount;

        // 2. Send the slashed funds to the CleanupDAO
        (bool success, ) = cleanupDAO.call{value: slashAmount}("");
        require(success, "Failed to send slashed funds");

        emit Slashed(factory, slashAmount, factoryStakes[factory]);
    }

    /**
     * @dev Admin settles a "wrongful slash" claim.
     * This function only updates accounting.
     * The ETH must be sent back from the DAO via approveRefund() first.
     */
    function settleClaim(address factory, uint refundAmount) external {
        require(msg.sender == admin, "Only admin");
        factoryStakes[factory] += refundAmount;
        emit ClaimSettled(factory, refundAmount);
    }

    /**
     * @dev Allows a factory to withdraw their bond.
     */
    function withdrawBond() external {
        uint amount = factoryStakes[msg.sender];
        require(amount > 0, "No stake");

        factoryStakes[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(msg.sender, amount);
    }
}