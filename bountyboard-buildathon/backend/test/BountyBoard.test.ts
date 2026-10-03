import { expect } from "chai";
import { ethers } from "hardhat";
import { BountyBoard, RejectingReceiver, ReentrantAttacker } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("BountyBoard", function () {
  let bountyBoard: BountyBoard;
  let creator: SignerWithAddress;
  let submitter1: SignerWithAddress;
  let submitter2: SignerWithAddress;
  let nonSubmitter: SignerWithAddress;

  const ONE_ETHER = ethers.parseEther("1.0");
  const TITLE = "Build Bauhaus UI";
  const DESCRIPTION = "Build an on-chain bounty marketplace using Bauhaus design system.";
  const SOLUTION_URI_1 = "https://github.com/developer/bounty-solution";
  const SOLUTION_URI_2 = "https://github.com/developer2/bounty-solution";

  beforeEach(async function () {
    [creator, submitter1, submitter2, nonSubmitter] = await ethers.getSigners();
    const BountyBoardFactory = await ethers.getContractFactory("BountyBoard");
    bountyBoard = await BountyBoardFactory.deploy();
    await bountyBoard.waitForDeployment();
  });

  describe("1. Valid bounty creation and stored values", function () {
    it("should create a bounty and store all values accurately", async function () {
      const tx = await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, {
        value: ONE_ETHER,
      });

      await expect(tx)
        .to.emit(bountyBoard, "BountyCreated")
        .withArgs(0, creator.address, TITLE, ONE_ETHER, (await ethers.provider.getBlock("latest"))!.timestamp);

      expect(await bountyBoard.bountyCount()).to.equal(1n);

      const bounty = await bountyBoard.getBounty(0);
      expect(bounty.id).to.equal(0n);
      expect(bounty.creator).to.equal(creator.address);
      expect(bounty.title).to.equal(TITLE);
      expect(bounty.description).to.equal(DESCRIPTION);
      expect(bounty.reward).to.equal(ONE_ETHER);
      expect(bounty.status).to.equal(0); // BountyStatus.Open
      expect(bounty.winner).to.equal(ethers.ZeroAddress);
      expect(bounty.submissionCount).to.equal(0n);
    });
  });

  describe("2. Zero reward rejection", function () {
    it("should revert if msg.value is 0", async function () {
      await expect(
        bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: 0 })
      ).to.be.revertedWith("Reward must be greater than zero");
    });
  });

  describe("3. Empty/invalid input rejection", function () {
    it("should revert if title is empty", async function () {
      await expect(
        bountyBoard.connect(creator).createBounty("", DESCRIPTION, { value: ONE_ETHER })
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("should revert if description is empty", async function () {
      await expect(
        bountyBoard.connect(creator).createBounty(TITLE, "", { value: ONE_ETHER })
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("should revert if solution URI is empty", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await expect(
        bountyBoard.connect(submitter1).submitSolution(0, "")
      ).to.be.revertedWith("Solution URI cannot be empty");
    });

    it("should revert if bounty ID does not exist", async function () {
      await expect(
        bountyBoard.getBounty(999)
      ).to.be.revertedWith("Bounty does not exist");

      await expect(
        bountyBoard.connect(submitter1).submitSolution(999, SOLUTION_URI_1)
      ).to.be.revertedWith("Bounty does not exist");
    });
  });

  describe("4. Valid solution submission", function () {
    it("should accept valid solution submission and store details", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });

      const tx = await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);

      await expect(tx)
        .to.emit(bountyBoard, "SolutionSubmitted")
        .withArgs(0, submitter1.address, SOLUTION_URI_1, (await ethers.provider.getBlock("latest"))!.timestamp);

      expect(await bountyBoard.hasUserSubmitted(0, submitter1.address)).to.be.true;

      const submissions = await bountyBoard.getSubmissions(0);
      expect(submissions.length).to.equal(1);
      expect(submissions[0].submitter).to.equal(submitter1.address);
      expect(submissions[0].solutionURI).to.equal(SOLUTION_URI_1);

      const bounty = await bountyBoard.getBounty(0);
      expect(bounty.submissionCount).to.equal(1n);
    });
  });

  describe("5. Duplicate submission rejection", function () {
    it("should revert if the same user submits more than once to the same bounty", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);

      await expect(
        bountyBoard.connect(submitter1).submitSolution(0, "https://github.com/developer/another")
      ).to.be.revertedWith("Address already submitted");
    });
  });

  describe("6. Creator self-submission rejection", function () {
    it("should revert if the creator attempts to submit to their own bounty", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });

      await expect(
        bountyBoard.connect(creator).submitSolution(0, SOLUTION_URI_1)
      ).to.be.revertedWith("Creator cannot submit to own bounty");
    });
  });

  describe("7. Submission after completion rejection", function () {
    it("should revert if a submission is made to a completed bounty", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);
      await bountyBoard.connect(creator).approveSubmission(0, submitter1.address);

      await expect(
        bountyBoard.connect(submitter2).submitSolution(0, SOLUTION_URI_2)
      ).to.be.revertedWith("Bounty is not open");
    });
  });

  describe("8. Non-creator approval rejection", function () {
    it("should revert if a non-creator attempts to approve a submission", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);

      await expect(
        bountyBoard.connect(submitter2).approveSubmission(0, submitter1.address)
      ).to.be.revertedWith("Only creator can approve");
    });
  });

  describe("9. Approval of a nonexistent submission rejection", function () {
    it("should revert if approving an address that never submitted", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);

      await expect(
        bountyBoard.connect(creator).approveSubmission(0, nonSubmitter.address)
      ).to.be.revertedWith("Winner has not submitted");
    });

    it("should revert if approving address(0)", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await expect(
        bountyBoard.connect(creator).approveSubmission(0, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid winner address");
    });
  });

  describe("10. Successful payout and correct recipient balance change", function () {
    it("should pay out the exact bounty reward to the winner", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);

      const balanceBefore = await ethers.provider.getBalance(submitter1.address);

      const tx = await bountyBoard.connect(creator).approveSubmission(0, submitter1.address);

      await expect(tx)
        .to.emit(bountyBoard, "BountyCompleted")
        .withArgs(0, submitter1.address, ONE_ETHER, (await ethers.provider.getBlock("latest"))!.timestamp);

      const balanceAfter = await ethers.provider.getBalance(submitter1.address);
      expect(balanceAfter - balanceBefore).to.equal(ONE_ETHER);
    });
  });

  describe("11. Completed status and winner storage", function () {
    it("should update status to Completed and store the winner address", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);
      await bountyBoard.connect(creator).approveSubmission(0, submitter1.address);

      const bounty = await bountyBoard.getBounty(0);
      expect(bounty.status).to.equal(1); // BountyStatus.Completed
      expect(bounty.winner).to.equal(submitter1.address);
    });
  });

  describe("12. Second payout/approval rejection", function () {
    it("should revert if trying to approve or pay out a completed bounty again", async function () {
      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await bountyBoard.connect(submitter1).submitSolution(0, SOLUTION_URI_1);
      await bountyBoard.connect(creator).approveSubmission(0, submitter1.address);

      await expect(
        bountyBoard.connect(creator).approveSubmission(0, submitter1.address)
      ).to.be.revertedWith("Bounty is not open");
    });
  });

  describe("13. Failed payout behavior", function () {
    it("should revert the approval transaction if recipient refuses payment", async function () {
      const RejectingFactory = await ethers.getContractFactory("RejectingReceiver");
      const rejectingReceiver = (await RejectingFactory.deploy(
        await bountyBoard.getAddress()
      )) as RejectingReceiver;
      await rejectingReceiver.waitForDeployment();

      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await rejectingReceiver.submit(0, SOLUTION_URI_1);

      await expect(
        bountyBoard.connect(creator).approveSubmission(0, await rejectingReceiver.getAddress())
      ).to.be.revertedWith("Payout transfer failed");

      // Verify state was not modified (remains Open, winner is address 0)
      const bounty = await bountyBoard.getBounty(0);
      expect(bounty.status).to.equal(0);
      expect(bounty.winner).to.equal(ethers.ZeroAddress);
    });
  });

  describe("14. Reentrancy protection", function () {
    it("should prevent reentrancy during payout approval", async function () {
      const AttackerFactory = await ethers.getContractFactory("ReentrantAttacker");
      const attacker = (await AttackerFactory.deploy(
        await bountyBoard.getAddress()
      )) as ReentrantAttacker;
      await attacker.waitForDeployment();

      await bountyBoard.connect(creator).createBounty(TITLE, DESCRIPTION, { value: ONE_ETHER });
      await attacker.submit(0, SOLUTION_URI_1);

      // When creator approves, attacker's receive function re-calls approveSubmission.
      // ReentrancyGuard reverts the reentrant call with "ReentrancyGuard: reentrant call"
      await expect(
        bountyBoard.connect(creator).approveSubmission(0, await attacker.getAddress())
      ).to.be.revertedWith("Payout transfer failed");
    });
  });
});
