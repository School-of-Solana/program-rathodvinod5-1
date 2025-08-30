"use client";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./Contants";

export const getCampaignPDA = (signer: PublicKey, title: string) => {
  const [campaignPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), signer.toBuffer(), Buffer.from(title)],
    PROGRAM_ID
  );
  return campaignPDA;
};

export const getContributionPDA = (
  campaign: PublicKey,
  contributor: PublicKey
) => {
  const [contributionPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("contribution"), campaign.toBuffer(), contributor.toBuffer()],
    PROGRAM_ID
  );
  return contributionPDA;
};

function toLamports(amountInSOL: string | number): bigint {
  return BigInt(Math.floor(Number(amountInSOL) * LAMPORTS_PER_SOL));
}

function toUnixTimestamp(datetime: string): number {
  return Math.floor(new Date(datetime).getTime() / 1000);
}

export function formatTimestamp(unixTimestamp: number): string {
  // Convert seconds → milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Format as readable string
  return date.toLocaleString("en-IN", {
    weekday: "short", // e.g., Mon
    year: "numeric",
    month: "short", // e.g., Jan
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function lamportsToSol(
  lamports: number | string | bigint,
  decimals = 9 // how many fraction digits to show (max 9)
): string {
  if (decimals < 0 || decimals > 9)
    throw new RangeError("decimals must be 0..9");

  // const LAMPORTS_PER_SOL = 1_000_000_000n;
  const lp = typeof lamports === "bigint" ? lamports : BigInt(lamports);

  const whole = lp / BigInt(LAMPORTS_PER_SOL);
  const rem = lp % BigInt(LAMPORTS_PER_SOL);

  if (rem === BigInt(0) || decimals === 0) return whole.toString();

  // produce fractional part with 9 digits, then trim to requested decimals
  const fracFull = rem.toString().padStart(9, "0");
  const fracTrimmed = fracFull.slice(0, decimals);

  // trim trailing zeros from fraction
  const frac = fracTrimmed.replace(/0+$/, "");

  return frac.length > 0 ? `${whole.toString()}.${frac}` : whole.toString();
}
