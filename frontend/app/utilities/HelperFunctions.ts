import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./Contants";

export const getCampaignPDA = (signer: PublicKey, title: string) => {
  const [campaignPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), signer.toBuffer(), Buffer.from(title)],
    PROGRAM_ID
  );
  return campaignPDA;
};

function toLamports(amountInSOL: string | number): bigint {
  return BigInt(Math.floor(Number(amountInSOL) * LAMPORTS_PER_SOL));
}

function toUnixTimestamp(datetime: string): number {
  return Math.floor(new Date(datetime).getTime() / 1000);
}
