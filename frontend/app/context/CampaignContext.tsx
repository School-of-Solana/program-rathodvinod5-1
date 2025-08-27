"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAnchor } from "./SolanaConnectionProgramProvider";

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
};

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<any[] | null>(null);

  const { program } = useAnchor();

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

  return (
    <CampaignContext.Provider value={{ campaigns, getCampaignById }}>
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
