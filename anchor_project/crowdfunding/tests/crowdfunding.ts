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

  // Test data
  const title = "Clean Water";
  const titleWithGoal0 = "Goal with 0";
  const description = "Funding for building wells";
  const goalAmount = new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL); // 2 SOL
  const deadline = new anchor.BN(
    Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60
  ); // +3 days
  const pastDeadline = new anchor.BN(Math.floor(Date.now() / 1000) - 60); // 1 min ago

  const bob = anchor.web3.Keypair.generate();
  let campaignPda: PublicKey;
  // const connection = provider.connection;

  describe("Create Campaign", () => {
    describe("Success cases for campaign", () => {
      it.only("should create a new campaign with valid inputs", async () => {
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

      it.only("should initialize campaign with correct PDA", async () => {
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
      it.only("should fail if campaign goal is zero", async () => {
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

      it.only("should fail if deadline is in the past", async () => {
        try {
          // Send create_campaign transaction with goalAmount = 0
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

      it("should fail if title/description exceeds length limit", async () => {
        const [campaignPdaWithTitleLengthExceed] =
          PublicKey.findProgramAddressSync(
            [
              anchor.utils.bytes.utf8.encode("campaign"),
              bob.publicKey.toBuffer(),
              anchor.utils.bytes.utf8.encode(title.repeat(10)),
            ],
            program.programId
          );

        try {
          // Send create_campaign transaction with goalAmount = 0
          const tx = await program.methods
            .initCampaign(
              title.repeat(10),
              description,
              new anchor.BN(goalAmount),
              new anchor.BN(pastDeadline)
            )
            .accounts({
              campaign: campaignPdaWithTitleLengthExceed as PublicKey,
              signer: bob.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([bob])
            .rpc();

          assert.fail("Expected transaction to fail but it succeeded");
        } catch (err: any) {}
      });
    });
  });

  describe("Success case for contribution", () => {
    it.only("Should successfully contrribute the campaign", async () => {});
  });
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
