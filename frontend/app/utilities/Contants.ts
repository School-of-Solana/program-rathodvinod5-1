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

export enum SuccessAndErrorType {
  SUCCESS = "success",
  ERROR = "error",
}

export enum SuccessMessage {
  CAMPAIGN_CREATED_SUCCESSFULLY = "Campaign created successfully!",
  CONTRIBUTION_SUCCESSFULL = "Contribution successful!",
  FUNDS_CLAIMED_SUCCESSFULLY = "Funds claimed successfully!",
}

export enum ErrorMessage {
  WALLET_NOT_CONNECTED = "Wallet not connected",
  INVALID_CONTRIBUTION_AMOUNT = "Invalid contribution amount",
  CAMPAIGN_NOT_FOUND = "Campaign not found",
  FAILED_TO_CREATE_CAMPAIGN = "Failed to create campaign",
  FAILED_TO_CONTRIBUTE = "Failed to contribute",
  CLAIM_FUNDS_FAILED = "Claiming funds failed",
}

export enum CloseAccountTypeEnum {
  CREATE_CAMPAIGN = "createCampaign",
  CONTRIBUTION = "contribution",
  CLAIM_FUNDS = "claimFunds",
  CLAIM_REFUND = "claimRefund",
}
