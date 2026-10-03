// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../BountyBoard.sol";

/**
 * @title RejectingReceiver
 * @notice Helper contract that rejects incoming ETH/MON transfers to test failed payouts.
 */
contract RejectingReceiver {
    BountyBoard public bountyBoard;

    constructor(address _bountyBoard) {
        bountyBoard = BountyBoard(_bountyBoard);
    }

    function submit(uint256 bountyId, string calldata uri) external {
        bountyBoard.submitSolution(bountyId, uri);
    }

    receive() external payable {
        revert("Rejecting payment");
    }
}

/**
 * @title ReentrantAttacker
 * @notice Helper contract that attempts to reenter BountyBoard upon receiving payout.
 */
contract ReentrantAttacker {
    BountyBoard public bountyBoard;
    uint256 public targetBountyId;
    bool public attacked;

    constructor(address _bountyBoard) {
        bountyBoard = BountyBoard(_bountyBoard);
    }

    function submit(uint256 bountyId, string calldata uri) external {
        targetBountyId = bountyId;
        bountyBoard.submitSolution(bountyId, uri);
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            // Attempt to re-enter approveSubmission
            bountyBoard.approveSubmission(targetBountyId, address(this));
        }
    }
}
