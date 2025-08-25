"use client";
import { ChangeEvent, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "../idl/crowdfunding.json";
import { getCampaignPDA } from "../utilities/HelperFunctions";
import { NETWORK, OPTS, PROGRAM_ID } from "../utilities/Contants";

const useCreateCampaign = () => {
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setDescription] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [deadline, setDeadline] = useState("");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

      // ✅ Setup connection + provider
      const connection = new web3.Connection(NETWORK, OPTS.preflightCommitment);
      // const anchorWallet =
      //   wallet && wallet.publicKey
      //     ? new (anchor.Wallet as any)(wallet)
      //     : undefined;
      // if (!anchorWallet) {
      //   throw new Error("Wallet not compatible with Anchor");
      // }
      // const provider = new AnchorProvider(connection, anchorWallet, OPTS);
      const provider = new AnchorProvider(connection, wallet, OPTS);
      const program = new Program(
        idl as unknown as anchor.Idl,
        PROGRAM_ID,
        provider
      );

      // ✅ Derive PDA
      const campaignPDA = getCampaignPDA(wallet.publicKey, campaignName);

      // ✅ Send TX
      const txSig = await program.methods
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
  };
};

export default useCreateCampaign;
