"use client";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

export const PROGRAM_ID = new PublicKey(
  "Ept1VxEScf1bzfkwfEous1ZCDj16QCirBBq9kXzYAgwG"
); // replace this after deployment

// Solana devnet RPC endpoint
export const NETWORK = "https://api.devnet.solana.com"; // "http://127.0.0.1:8899"; //

// Commitment level
export const OPTS = {
  preflightCommitment: "processed" as anchor.web3.Commitment,
};
