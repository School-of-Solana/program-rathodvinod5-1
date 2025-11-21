import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Crowdfunding } from "../target/types/crowdfunding";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";

describe("Crowdfunding Program", () => {
  // Anchor provider + program reference
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Crowdfunding as Program<Crowdfunding>; // type: Crowdfunding

  // const provider = new anchor.AnchorProvider(
  //   new anchor.web3.Connection("http://127.0.0.1:8890"), // match Anchor.toml
  //   anchor.Wallet.local(),
  //   { commitment: "confirmed" }
  // );
  // anchor.setProvider(provider);

  // Test data
  const title = "Clean Water";
  const titleWithGoal0 = "Goal with 0";
  const titleForMissingSigner = "Signer Missing Campaign";
  const description = "Funding for building wells";
  const descriptionForMissingSigner =
    "This should fail because signer is missing";
  const goalAmount = new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL); // 2 SOL
  const contributeAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
  const deadline = new anchor.BN(
    Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60
  ); // +3 days
  const pastDeadline = new anchor.BN(Math.floor(Date.now() / 1000) - 60); // 1 min ago

  const bob = anchor.web3.Keypair.generate();
  const alice = anchor.web3.Keypair.generate();
  const contributor3 = anchor.web3.Keypair.generate();

  let campaignPda: PublicKey;
  let contributionPda: PublicKey;
  // const connection = provider.connection;

  describe("Create Campaign", () => {
    describe("Success cases for campaign", () => {
      it("should create a new campaign with valid inputs", async () => {
        await airdrop(provider.connection, bob.publicKey);

        // Derive PDA for campaign
        [campaignPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(title),
          ],
          program.programId
        );

        // Send create_campaign transaction
        const tx = await program.methods
          .initCampaign(
            title, // ✅ must be <= 30 chars
            description, // ✅ must be <= 50 chars
            new anchor.BN(goalAmount),
            new anchor.BN(deadline) // 1 day later
          )
          .accounts({
            campaign: campaignPda as PublicKey,
            signer: bob.publicKey,
            // systemProgram: SystemProgram.programId,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      });

      it("should initialize campaign with correct PDA", async () => {
        // TODO: derive PDA
        const [expectedPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(title),
          ],
          program.programId
        );

        // TODO: check stored data matches expectations
        await validateCampaign(
          program,
          // provider,
          bob.publicKey,
          expectedPda,
          title,
          description,
          goalAmount,
          deadline
        );
      });
    });

    describe("Failure cases", () => {
      it("should fail if campaign goal is zero", async () => {
        const [campaignPdaWithGoalZero] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(titleWithGoal0),
          ],
          program.programId
        );

        try {
          // Send create_campaign transaction with goalAmount = 0
          const tx = await program.methods
            .initCampaign(
              titleWithGoal0,
              description,
              new anchor.BN(0),
              new anchor.BN(deadline) // 1 day later
            )
            .accounts({
              campaign: campaignPdaWithGoalZero as PublicKey,
              signer: bob.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob])
            .rpc();

          assert.fail("Expected transaction to fail but it succeeded");
        } catch (err: any) {
          // console.log("Error Occured: ", err);
          // assert.include(err.error.errorMessage, "InvalidGoal");
        }
      });

      it("should fail if deadline is in the past", async () => {
        try {
          const tx = await program.methods
            .initCampaign(
              title,
              description,
              new anchor.BN(goalAmount),
              new anchor.BN(pastDeadline)
            )
            .accounts({
              campaign: campaignPda as PublicKey,
              signer: bob.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob])
            .rpc();

          assert.fail("Expected transaction to fail but it succeeded");
        } catch (err: any) {}
      });

      // it("should fail if title/description exceeds length limit", async () => {
      //   const [campaignPdaWithTitleLengthExceed] =
      //     PublicKey.findProgramAddressSync(
      //       [
      //         anchor.utils.bytes.utf8.encode("campaign"),
      //         bob.publicKey.toBuffer(),
      //         anchor.utils.bytes.utf8.encode(title.repeat(10)),
      //       ],
      //       program.programId
      //     );

      //   try {
      //     const tx = await program.methods
      //       .initCampaign(
      //         title.repeat(10),
      //         description,
      //         new anchor.BN(goalAmount),
      //         new anchor.BN(pastDeadline)
      //       )
      //       .accounts({
      //         campaign: campaignPdaWithTitleLengthExceed as PublicKey,
      //         signer: bob.publicKey,
      //         systemProgram: anchor.web3.SystemProgram.programId,
      //       })
      //       .signers([bob])
      //       .rpc();

      //     assert.fail("Expected transaction to fail but it succeeded");
      //   } catch (err: any) {
      //     assert.include(
      //       err.message,
      //       "custom program error",
      //       "Expected custom program error for exceeding length limit"
      //     );
      //   }
      // });
    });
  });

  describe("Contribute to campaign", async () => {
    describe("Success case for contribution", async () => {
      await airdrop(provider.connection, bob.publicKey, 10 * LAMPORTS_PER_SOL);
      await airdrop(provider.connection, alice.publicKey, 5 * LAMPORTS_PER_SOL);
      await airdrop(
        provider.connection,
        contributor3.publicKey,
        10 * LAMPORTS_PER_SOL
      );

      it("Should successfully contribute to the campaign", async () => {
        [contributionPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            campaignPda.toBuffer(),
            bob.publicKey.toBuffer(),
          ],
          program.programId
        );
        const tx = await program.methods
          .contributeAmount(new anchor.BN(contributeAmount))
          .accounts({
            campaign: campaignPda,
            contributor: bob.publicKey,
            contribution: contributionPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      });

      // it("Should allow multiple contributions from the same contributor", async () => {
      //   await program.methods
      //     .contributeAmount(new anchor.BN(contributeAmount))
      //     .accounts({
      //       campaign: campaignPda,
      //       contributor: bob.publicKey,
      //       contribution: contributionPda,
      //       systemProgram: anchor.web3.SystemProgram.programId,
      //     })
      //     .signers([bob])
      //     .rpc();

      //   await program.methods
      //     .contributeAmount(new anchor.BN(contributeAmount))
      //     .accounts({
      //       campaign: campaignPda,
      //       contributor: bob.publicKey,
      //       contribution: contributionPda,
      //       systemProgram: anchor.web3.SystemProgram.programId,
      //     })
      //     .signers([bob])
      //     .rpc();
      // });

      it("Should allow multiple contributors and should correctly record contributor’s donation", async () => {
        const [contributionPdaBob] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            campaignPda.toBuffer(),
            bob.publicKey.toBuffer(),
          ],
          program.programId
        );

        const [contributionPdaAlice] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            campaignPda.toBuffer(),
            alice.publicKey.toBuffer(),
          ],
          program.programId
        );

        // Alice contributes
        await program.methods
          .contributeAmount(new anchor.BN(1_000_000_000)) // or contributeAmount
          .accounts({
            campaign: campaignPda,
            contribution: contributionPdaAlice,
            contributor: alice.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([alice])
          .rpc();

        // Bob contributes already present from above cases
        // await program.methods
        //   .contributeAmount(new anchor.BN(1_000_000_000))
        //   .accounts({
        //     campaign: campaignPda,
        //     contribution: contributionPdaBob,
        //     contributor: bob.publicKey,
        //     systemProgram: anchor.web3.SystemProgram.programId,
        //   })
        //   .signers([bob])
        //   .rpc();

        // Fetch both contributions
        const aliceContribution = await program.account.contribution.fetch(
          contributionPdaAlice
        );
        const bobContribution = await program.account.contribution.fetch(
          contributionPdaBob
        );

        assert.equal(
          aliceContribution.totalAmountDonated.toNumber(),
          1_000_000_000,
          "Alice's contribution not recorded correctly"
        );
        assert.equal(
          bobContribution.totalAmountDonated.toNumber(),
          1_000_000_000,
          "Bob's contribution not recorded correctly"
        );
      });
    });

    describe("Failure case for contribution", () => {
      it("Should fail if contribution is 0 lamports", async () => {
        const [contributor3Pda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            campaignPda.toBuffer(),
            bob.publicKey.toBuffer(),
          ],
          program.programId
        );

        try {
          await program.methods
            .contributeAmount(new anchor.BN(0)) // or contributeAmount
            .accounts({
              campaign: campaignPda,
              contribution: contributor3Pda,
              contributor: contributor3.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([alice])
            .rpc();

          assert.fail(
            "Expected contribution with 0 lamports to fail but it succeeded"
          );
        } catch (error: any) {}
      });

      it("Should fail if contribution is negative (if attempted via BN manipulation)", async () => {
        const [contributor3Pda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            campaignPda.toBuffer(),
            bob.publicKey.toBuffer(),
          ],
          program.programId
        );

        try {
          await program.methods
            .contributeAmount(new anchor.BN(-1)) // or contributeAmount
            .accounts({
              campaign: campaignPda,
              contribution: contributor3Pda,
              contributor: contributor3.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([alice])
            .rpc();

          assert.fail(
            "Expected contribution with 0 lamports to fail but it succeeded"
          );
        } catch (error: any) {}
      });

      // it("Should fail if campaign deadline has passed", () => {});
      // it("Should fail if campaign is already successfully funded and closed", () => {});

      it("Should fail if signer is missing", async () => {
        // derive a campaign PDA for this test
        const [campaignPdaForMissingSigner] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(titleForMissingSigner),
          ],
          program.programId
        );

        // Try to initCampaign without adding bob as a signer
        try {
          await program.methods
            .initCampaign(
              titleForMissingSigner,
              descriptionForMissingSigner,
              new anchor.BN(5_000), // goal
              new anchor.BN(Math.floor(Date.now() / 1000) + 60) // valid deadline
            )
            .accounts({
              campaign: campaignPdaForMissingSigner,
              signer: bob.publicKey, // signer account provided but not signed
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            // 🚨 notice: no .signers([bob]) here
            .rpc();

          assert.fail("Expected transaction to fail, but it succeeded");
        } catch (err: any) {}
      });

      it("Should fail if campaign PDA is invalid", async () => {
        // Derive a random invalid PDA (not matching seeds in program)
        const invalidCampaign = anchor.web3.Keypair.generate(); // totally random account
        const [contributor3Pda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            invalidCampaign.publicKey.toBuffer(),
            bob.publicKey.toBuffer(),
          ],
          program.programId
        );

        try {
          await program.methods
            .contributeAmount(new anchor.BN(1_000_000)) // send 0.001 SOL
            .accounts({
              campaign: invalidCampaign.publicKey, // 🚨 invalid PDA
              contributor: bob.publicKey,
              contribution: contributor3Pda,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob]) // bob signs
            .rpc();

          assert.fail("Expected transaction to fail, but it succeeded");
        } catch (err: any) {}
      });
    });
  });

  describe("Claim Funds", () => {
    describe("Success cases for Claiming funds", () => {
      it("Should allow author to claim funds after deadline if goal met", async () => {
        const newDeadline = new anchor.BN(Math.floor(Date.now() / 1000) + 2); // 2 seconds from now
        // Derive PDA for campaign
        const [newCampaignPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode("New Campaign"),
          ],
          program.programId
        );

        // Send create_campaign transaction
        const tx = await program.methods
          .initCampaign(
            "New Campaign",
            description,
            new anchor.BN(goalAmount),
            new anchor.BN(newDeadline)
          )
          .accounts({
            campaign: newCampaignPda as PublicKey,
            signer: bob.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();

        const balanceBefore = await provider.connection.getBalance(
          bob.publicKey
        );

        const [contributionPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            newCampaignPda.toBuffer(),
            contributor3.publicKey.toBuffer(),
          ],
          program.programId
        );

        await program.methods
          .contributeAmount(new anchor.BN(2 * LAMPORTS_PER_SOL))
          .accounts({
            campaign: newCampaignPda,
            contributor: contributor3.publicKey,
            contribution: contributionPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([contributor3])
          .rpc();

        await new Promise((resolve) => setTimeout(resolve, 3000));

        await program.methods
          .claimFundByAuthor()
          .accounts({
            campaign: newCampaignPda,
            creator: bob.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();

        // 6. Get balance after withdrawal
        const balanceAfter = await provider.connection.getBalance(
          bob.publicKey
        );
        // 7. Assertions
        assert.isAbove(
          balanceAfter,
          balanceBefore,
          "Author should receive funds after deadline if goal is met"
        );
      });
    });

    describe("Failure cases for Claiming funds", () => {
      let newCampaignPda: PublicKey;
      it("Should fail if author tries to claim funds before deadline", async () => {
        try {
          await program.methods
            .claimFundByAuthor()
            .accounts({
              campaign: campaignPda,
              creator: bob.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob])
            .rpc();

          assert.fail("Expected transaction to fail but it succeeded");
        } catch (error: any) {}
      });

      it("Claim fund should fail if total_raised < goal_amount after deadline", async () => {
        const newDeadline = new anchor.BN(Math.floor(Date.now() / 1000) + 2); // 2 seconds from now

        [newCampaignPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("campaign"),
            bob.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode("New Failing Campaign"),
          ],
          program.programId
        );

        // Send create_campaign transaction
        const tx = await program.methods
          .initCampaign(
            "New Failing Campaign",
            description,
            new anchor.BN(goalAmount),
            new anchor.BN(newDeadline) // 2 seconds
          )
          .accounts({
            campaign: newCampaignPda as PublicKey,
            signer: bob.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();

        const [contributionPda] = PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("contributor"),
            newCampaignPda.toBuffer(),
            contributor3.publicKey.toBuffer(),
          ],
          program.programId
        );

        await program.methods
          .contributeAmount(new anchor.BN(1 * LAMPORTS_PER_SOL))
          .accounts({
            campaign: newCampaignPda,
            contributor: contributor3.publicKey,
            contribution: contributionPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([contributor3])
          .rpc();

        try {
          await program.methods
            .claimFundByAuthor()
            .accounts({
              campaign: newCampaignPda,
              creator: bob.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob])
            .rpc();
          assert.fail("Expected transaction to fail but it succeeded");
        } catch (error: any) {}
      });

      it("Should fail if non-author tries to claim funds after deadline", async () => {
        try {
          await program.methods
            .claimFundByAuthor()
            .accounts({
              campaign: newCampaignPda,
              creator: alice.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([alice])
            .rpc();
          assert.fail("Expected transaction to fail but it succeeded");
        } catch (error: any) {}
      });
    });
  });

  // describe("Claim Refunds", () => {
  //   describe("Success cases for Claiming funds", () => {
  //     it("Should allow author to claim funds after deadline if goal met", () => {});
  //   });

  //   describe("Failure cases for Claiming funds", () => {
  //     it("Should fail if author tries to claim funds before deadline", () => {});

  //     it("Should fail if total_raised < goal_amount after deadline", () => {});

  //     it("Should fail if non-author tries to claim funds after deadline", () => {});
  //   });
  // });
});

async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    "confirmed"
  );
}

async function validateCampaign(
  program: anchor.Program<Crowdfunding>,
  // provider: anchor.AnchorProvider,
  creator: PublicKey,
  campaignPda: PublicKey,
  title: String,
  description: String,
  goalAmount: anchor.BN,
  deadline: anchor.BN
) {
  // Fetch account and assert values
  const campaignAccount = await program.account.campaign.fetch(campaignPda);

  assert.equal(
    campaignAccount.creator.toBase58(),
    creator.toBase58(),
    "Creator should match provider wallet public key"
  );

  assert.equal(
    campaignAccount.title,
    title,
    "Title should match the initialized value"
  );

  assert.equal(
    campaignAccount.description,
    description,
    "Description should match the initialized value"
  );

  assert.equal(
    campaignAccount.goalAmount.toString(),
    goalAmount.toString(),
    "Goal amount should match the initialized value"
  );

  assert.equal(
    campaignAccount.deadline.toString(),
    deadline.toString(),
    "Deadline should match the initialized value"
  );

  assert.equal(
    campaignAccount.totalDonated.toNumber(),
    0,
    "Total donated should be initialized to 0"
  );
}

async function validateFundsAfterSuccess(
  program: anchor.Program<Crowdfunding>,
  creator: PublicKey,
  balanceBefore: number
) {}
