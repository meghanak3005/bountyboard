// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title BountyBoard
 * @notice On-chain bounty marketplace MVP for Monad Testnet.
 * Creators escrow MON rewards for bounties, developers submit solution URLs,
 * and creators approve one submission to trigger immediate payout.
 */
contract BountyBoard {
    enum BountyStatus {
        Open,
        Completed,
        Cancelled
    }

    struct Submission {
        address submitter;
        string solutionURI;
        uint256 submittedAt;
    }

    struct Bounty {
        uint256 id;
        address payable creator;
        string title;
        string description;
        uint256 reward;
        uint256 createdAt;
        BountyStatus status;
        address winner;
        uint256 submissionCount;
    }

    // State variables
    uint256 public bountyCount;
    mapping(uint256 => Bounty) private _bounties;
    mapping(uint256 => Submission[]) private _submissions;
    mapping(uint256 => mapping(address => bool)) public hasUserSubmitted;

    // Mutex for reentrancy protection
    bool private _locked;

    // Events
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        string title,
        uint256 reward,
        uint256 createdAt
    );

    event SolutionSubmitted(
        uint256 indexed bountyId,
        address indexed submitter,
        string solutionURI,
        uint256 submittedAt
    );

    event BountyCompleted(
        uint256 indexed bountyId,
        address indexed winner,
        uint256 reward,
        uint256 completedAt
    );

    // Modifiers
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    modifier bountyExists(uint256 bountyId) {
        require(bountyId < bountyCount, "Bounty does not exist");
        _;
    }

    /**
     * @notice Create a new bounty by depositing a MON reward.
     * @param title Title of the task/bounty.
     * @param description Detailed requirements for the bounty.
     * @return bountyId The unique ID of the created bounty.
     */
    function createBounty(
        string calldata title,
        string calldata description
    ) external payable returns (uint256 bountyId) {
        require(msg.value > 0, "Reward must be greater than zero");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        bountyId = bountyCount;
        bountyCount++;

        _bounties[bountyId] = Bounty({
            id: bountyId,
            creator: payable(msg.sender),
            title: title,
            description: description,
            reward: msg.value,
            createdAt: block.timestamp,
            status: BountyStatus.Open,
            winner: address(0),
            submissionCount: 0
        });

        emit BountyCreated(
            bountyId,
            msg.sender,
            title,
            msg.value,
            block.timestamp
        );
    }

    /**
     * @notice Submit a solution link for an open bounty.
     * @param bountyId The ID of the bounty.
     * @param solutionURI Link to code repository, demo, or solution.
     */
    function submitSolution(
        uint256 bountyId,
        string calldata solutionURI
    ) external bountyExists(bountyId) {
        Bounty storage bounty = _bounties[bountyId];

        require(bounty.status == BountyStatus.Open, "Bounty is not open");
        require(msg.sender != bounty.creator, "Creator cannot submit to own bounty");
        require(!hasUserSubmitted[bountyId][msg.sender], "Address already submitted");
        require(bytes(solutionURI).length > 0, "Solution URI cannot be empty");

        hasUserSubmitted[bountyId][msg.sender] = true;
        bounty.submissionCount++;

        _submissions[bountyId].push(Submission({
            submitter: msg.sender,
            solutionURI: solutionURI,
            submittedAt: block.timestamp
        }));

        emit SolutionSubmitted(
            bountyId,
            msg.sender,
            solutionURI,
            block.timestamp
        );
    }

    /**
     * @notice Approve a winning submission and release the escrowed reward.
     * @param bountyId The ID of the bounty.
     * @param winner Address of the submitter selected as winner.
     */
    function approveSubmission(
        uint256 bountyId,
        address winner
    ) external bountyExists(bountyId) nonReentrant {
        Bounty storage bounty = _bounties[bountyId];

        require(msg.sender == bounty.creator, "Only creator can approve");
        require(bounty.status == BountyStatus.Open, "Bounty is not open");
        require(winner != address(0), "Invalid winner address");
        require(hasUserSubmitted[bountyId][winner], "Winner has not submitted");

        // Checks-Effects
        uint256 rewardAmount = bounty.reward;
        bounty.status = BountyStatus.Completed;
        bounty.winner = winner;

        emit BountyCompleted(
            bountyId,
            winner,
            rewardAmount,
            block.timestamp
        );

        // Interactions
        (bool success, ) = payable(winner).call{value: rewardAmount}("");
        require(success, "Payout transfer failed");
    }

    /**
     * @notice Get full details of a bounty.
     */
    function getBounty(
        uint256 bountyId
    ) external view bountyExists(bountyId) returns (Bounty memory) {
        return _bounties[bountyId];
    }

    /**
     * @notice Get all submissions for a bounty.
     */
    function getSubmissions(
        uint256 bountyId
    ) external view bountyExists(bountyId) returns (Submission[] memory) {
        return _submissions[bountyId];
    }

    /**
     * @notice Get all bounties in a single call for efficient frontend browsing.
     */
    function getAllBounties() external view returns (Bounty[] memory) {
        Bounty[] memory all = new Bounty[](bountyCount);
        for (uint256 i = 0; i < bountyCount; i++) {
            all[i] = _bounties[i];
        }
        return all;
    }
}
