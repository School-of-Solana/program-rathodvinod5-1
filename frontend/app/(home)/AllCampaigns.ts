import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import idl from "../idl/crowdfunding.json";
import { PROGRAM_ID } from "../utilities/Contants";
import { AnchorProvider } from "@project-serum/anchor";
import { useProgram } from "../context/ProgramContextProvider";

export async function getAllCampaigns(wallet: any) {
  const { program } = useProgram();

  // This fetches ALL accounts of type Campaign owned by your program
  const campaigns = await program?.account.campaign.all();

  return campaigns?.map((c) => ({
    pubkey: c.publicKey.toBase58(),
    ...c.account,
  }));
}
