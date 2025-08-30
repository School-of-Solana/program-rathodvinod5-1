import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  ErrorMessage,
  SuccessAndErrorType,
  SuccessMessage,
} from "../utilities/Contants";

export type CampaignType = {
  id: string;
  name: string;
  description: string;
  goal: number;
  deadline: Date;
};

export type SuccessAndErrorDetailsType = {
  type: SuccessAndErrorType;
  title?: string;
  message: ErrorMessage | SuccessMessage | string;
};

export type FormInputErrorTypes = {
  campaignName?: string;
  campaignDescription?: string;
  goalAmount?: string;
  deadline?: string;
};

export type ContributionAccountType = {
  totalAmountDonated: anchor.BN;
  campaign: PublicKey;
  contributor: PublicKey;
  // add other fields from your Contribution struct here
};
