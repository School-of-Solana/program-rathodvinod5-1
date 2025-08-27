"use client";
import { ChangeEvent, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import {
  getCampaignPDA,
  getContributionPDA,
} from "../utilities/HelperFunctions";
import { NETWORK, OPTS, PROGRAM_ID } from "../utilities/Contants";
import { useAnchor } from "../context/SolanaConnectionProgramProvider";
import { PublicKey } from "@solana/web3.js";
// import { useProgram } from "../context/ProgramContextProvider";

const useCreateCampaign = () => {
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setDescription] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // const { program } = useProgram();
  const { program } = useAnchor();

  const wallet = useWallet(); // ✅ full wallet object (with publicKey + signTransaction)

  const onChangeCampaignName = (event: ChangeEvent<HTMLInputElement>) =>
    setCampaignName(event.target.value);

  const onChangeCampaignDescription = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setDescription(event.target.value);

  const onChangeGoalAmount = (event: ChangeEvent<HTMLInputElement>) =>
    setGoalAmount(event.target.value);

  const onChangeDeadline = (event: ChangeEvent<HTMLInputElement>) =>
    setDeadline(event.target.value);

  const handleCreateCampaign = async () => {
    console.log("handleCreateCampaign");
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      return;
    }

    try {
      setIsProcessing(true);

      // ✅ Convert inputs
      const goalLamports = new BN(goalAmount); // Keep in lamports for now
      const deadlineUnix = new BN(
        Math.floor(new Date(deadline).getTime() / 1000)
      );

      // ✅ Derive PDA
      const campaignPDA = getCampaignPDA(wallet.publicKey, campaignName);

      // ✅ Send TX
      const txSig = await program?.methods
        .initCampaign(
          campaignName,
          campaignDescription,
          goalLamports,
          deadlineUnix
        )
        .accounts({
          signer: wallet.publicKey,
          campaign: campaignPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Campaign created with tx:", txSig);
      console.log("📍 Campaign PDA:", campaignPDA.toBase58());
    } catch (err) {
      console.error("❌ Failed to create campaign:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const contributToCampaign = async (campaignPda: PublicKey) => {
    console.log("contributToCampaign");
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      return;
    }

    if (!goalAmount && Number(goalAmount) > 0) {
      alert("Please enter a valid contribution amount.");
      return;
    }

    try {
      setIsProcessing(true);

      // ✅ Convert inputs
      const goalLamports = new BN(goalAmount);
      const contributionPda = getContributionPDA(campaignPda, wallet.publicKey);

      const txSig = await program?.methods
        .contributeAmount(goalLamports)
        .accounts({
          signer: wallet.publicKey,
          campaign: campaignPda,
          contirbution: contributionPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Contributed to campaign with tx:", txSig);
      console.log("📍 Contribution PDA:", contributionPda.toBase58());
    } catch (err) {
      console.error("❌ Failed to contribute to campaign:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFormData = () => {
    setCampaignName("");
    setDescription("");
    setGoalAmount("");
    setDeadline("");
  };

  return {
    campaignName,
    campaignDescription,
    goalAmount,
    deadline,
    isProcessing,
    onChangeCampaignName,
    onChangeCampaignDescription,
    onChangeGoalAmount,
    onChangeDeadline,
    handleCreateCampaign,
    clearFormData,
    contributToCampaign,
  };
};

export default useCreateCampaign;

// Hd8Hcqi261cs426afPUFzfhUuDGg3XEiUqvpo7oADEgF
