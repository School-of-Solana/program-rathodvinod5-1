import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crowdfunding } from "../target/types/crowdfunding";

// describe("crowdfunding", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.crowdfunding as Program<Crowdfunding>;

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

describe("Crowdfunding Program", () => {
  // Anchor provider + program reference
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Crowdfunding as Program; // type: Crowdfunding

  describe("Create Campaign", () => {
    describe("Success cases", () => {
      it("should create a new campaign with valid inputs", async () => {
        // TODO: call create_campaign instruction
        // TODO: fetch account and assert values
      });

      it("should initialize campaign with correct PDA", async () => {
        // TODO: derive PDA
        // TODO: check stored data matches expectations
      });
    });

    describe("Failure cases", () => {
      it("should fail if campaign goal is zero", async () => {
        // TODO: expect error
      });

      it("should fail if deadline is in the past", async () => {
        // TODO: expect error
      });

      it("should fail if title/description exceeds length limit", async () => {
        // TODO: expect error
      });
    });
  });
});
