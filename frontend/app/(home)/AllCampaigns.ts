import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import idl from "../idl/crowdfunding.json";
import { PROGRAM_ID } from "../utilities/Contants";
import { AnchorProvider } from "@project-serum/anchor";
import { useProgram } from "../context/ProgramContextProvider";

const connection = new Connection("https://api.devnet.solana.com");

export async function getAllCampaigns(wallet: any) {
  //   const provider = new AnchorProvider(
  //     connection,
  //     wallet,
  //     AnchorProvider.defaultOptions()
  //   );
  //   const program = new Program(idl as any, PROGRAM_ID, provider);
  const { program } = useProgram();

  // This fetches ALL accounts of type Campaign owned by your program
  const campaigns = await program?.account.campaign.all();

  return campaigns?.map((c) => ({
    pubkey: c.publicKey.toBase58(),
    ...c.account,
  }));
}
