"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAnchor } from "./SolanaConnectionProgramProvider";
import { PublicKey } from "@solana/web3.js";

export type Campaign = {
  publicKey: string; // unique id (could be publicKey.toBase58())
  title: string;
  description: string;
  goalAmount: string;
  totalDonated: string;
  deadline: string; // unix timestamp
  author: string; // wallet address
};

type CampaignContextType = {
  campaigns: any[] | null;
  //   setCampaigns: (campaigns: Campaign[]) => void;
  //   addCampaign: (campaign: Campaign) => void;
  getCampaignById: (id: string) => Campaign | undefined | any;
  fetchDetailsOfCampaingAccount: (campaignId: PublicKey) => {};
};

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<any[] | null>(null);

  const { program, connection } = useAnchor();

  useEffect(() => {
    // console.log("in useEffect");
    if (!campaigns) {
      fetchCampaigns();
    }
  }, [program]);

  const fetchCampaigns = async () => {
    try {
      let campaigns = await program?.account?.campaign?.all();
      setCampaigns(campaigns);
      console.log("Fetched campaigns:", campaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      return [];
    }
  };

  //   const setCampaigns = (newCampaigns: Campaign[]) => {
  //     setCampaignsState(newCampaigns);
  //   };

  //   const addCampaign = (campaign: Campaign) => {
  //     setCampaignsState((prev) => [...prev, campaign]);
  //   };

  const getCampaignById = (id: string) => {
    return campaigns?.find((c) => c.publicKey === id);
  };

  const fetchDetailsOfCampaingAccount = async (accountPublicKey: PublicKey) => {
    try {
      const accountInfo = await connection.getAccountInfo(accountPublicKey);
      console.log("accountInfo:", accountInfo);
      // campaigns.map(campaign =>
      //   campaign.id === campaignId ? newCampaign : campaign
      // );
      setCampaigns((prevCampaigns) => {
        const updatedCampaigns = prevCampaigns!.map(
          (campaign) =>
            campaign.publicKey === accountPublicKey.toBase58()
              ? accountInfo
              : campaign
          // campaign.id === campaignId ? accountInfo : campaign
        );
        return updatedCampaigns;
      });
    } catch (err) {
      console.error("❌ Failed to fetch account details:", err);
    }
  };

  return (
    <CampaignContext.Provider
      value={{ campaigns, getCampaignById, fetchDetailsOfCampaingAccount }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// ✅ Hook to use context
export const useCampaignsContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignsContext must be used within a CampaignProvider"
    );
  }
  return context;
};
