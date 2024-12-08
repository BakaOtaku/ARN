// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AdminBet is Ownable {
    // Define the struct with required fields
    struct BetInfo {
        uint256 totalTokensLocked;
        address userAddress;
        bool resolved;
    }
    
    // Mapping from uint32 to BetInfo struct
    mapping(uint32 => BetInfo) public bets;
    
    // Event to emit when a new bet is made
    event BetMade(uint32 indexed betId, address indexed better, uint256 amount);
    event BetResolved(uint32 indexed betId, address indexed winner, uint256 amount);
    
    // Function to add or update bet information
    function setBet(uint32 betId, uint256 _totalTokensLocked) private {
        // Ensure a new bet isn't overwriting an active or resolved one
        require(!bets[betId].resolved, "Cannot overwrite a resolved bet");

        bets[betId] = BetInfo({
            totalTokensLocked: _totalTokensLocked,
            userAddress: address(0),
            resolved: false
        });
    }
    
    // Function to get bet information
    function getBet(uint32 betId) external view returns (BetInfo memory) {
        return bets[betId];
    }
    
    // Function to make a bet with ETH
    function makeBet(uint32 betId) external payable {
        BetInfo storage currentBet = bets[betId];

        // check if betid exists , if not create it
        if (currentBet.totalTokensLocked == 0) {
            setBet(betId, msg.value);
        }
        
        require(!currentBet.resolved, "Bet is already resolved");
        require(msg.value > 0, "Must send ETH to make a bet");

        currentBet.totalTokensLocked += msg.value;
        
        emit BetMade(betId, msg.sender, msg.value);
    }

    // Function to resolve a bet
    function resolveBet(uint32 betId, address winner) external onlyOwner {
        BetInfo storage bet = bets[betId];
        
        require(!bet.resolved, "Bet is already resolved");
        require(bet.totalTokensLocked > 0, "No tokens locked in the bet");
        require(winner != address(0), "Invalid winner address");

        bet.resolved = true;
        bet.userAddress = winner;

        // Transfer ETH to the winner
        uint256 payout = bet.totalTokensLocked;
        bet.totalTokensLocked = 0; // Prevent re-entrancy

        (bool success, ) = winner.call{value: payout}("");
        require(success, "Failed to send ETH to the winner");
        
        emit BetResolved(betId, winner, payout);
    }

    // Fallback function to receive ETH directly
    receive() external payable {}
}
