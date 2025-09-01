"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomButton from "../components/Button";
import useCreateCampaign from "../create/useCreateCampaign";

const ButtonsComponent = ({
  isContributionProcessing = false,
  isClaimFundsProcessing = false,
  isClaimRefundProcessing = false,
  isCloseAccountProcessing = false,
  canDeleteAccount = false,
  campaignPublicKey,
  onClickContributeButton,
  onClickClaimButton,
  onClickClaimRefundButton,
  onClickDeleteCampaignAccount,
  isCampaignActive = false,
  previousContributionAmount = "",
  campaignAmount = "",
}: {
  isContributionProcessing?: boolean;
  isClaimFundsProcessing?: boolean;
  campaignPublicKey?: string;
  isClaimRefundProcessing?: boolean;
  isCloseAccountProcessing?: boolean;
  canDeleteAccount?: boolean;
  onClickContributeButton?: () => void;
  onClickClaimButton?: () => void;
  onClickClaimRefundButton?: () => void;
  onClickDeleteCampaignAccount?: () => void;
  isCampaignActive?: boolean;
  previousContributionAmount?: string;
  campaignAmount?: string;
}) => {
  const { publicKey, connected, connect, disconnect } = useWallet();
  // const { isProcessing, contributToCampaign } = useCreateCampaign();

  const isCreator = (() => {
    let pubKey = JSON.stringify(campaignPublicKey);
    pubKey = pubKey.replace(/"/g, "");
    console.log("pubKey: ", pubKey);
    return pubKey === publicKey?.toString();
  })();

  console.log("isCreator", isCreator, isContributionProcessing);

  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      {isCampaignActive ? (
        <CustomButton
          title="Contribute"
          onClick={onClickContributeButton}
          customCss="w-[200px]"
        >
          {isContributionProcessing ? (
            <div className="w-6 h-6 animate-spin rounded-full border-dashed border-6 border-white" />
          ) : (
            <p>Contribute</p>
          )}
        </CustomButton>
      ) : null}

      {Number(previousContributionAmount) > 0 ? (
        <CustomButton
          title="Contribute"
          onClick={onClickClaimRefundButton}
          customCss="w-[200px]"
        >
          {isClaimRefundProcessing ? (
            <div className="w-6 h-6 animate-spin rounded-full border-dashed border-6 border-white" />
          ) : (
            <p>Claim Refund</p>
          )}
        </CustomButton>
      ) : null}

      {isCreator && Number(campaignAmount) <= 0 ? (
        <CustomButton
          title="Claim Funds"
          onClick={onClickClaimButton}
          customCss="w-[200px]"
        >
          {isClaimFundsProcessing ? (
            <div className="w-6 h-6 animate-spin rounded-full border-dashed border-6 border-white" />
          ) : (
            <p>Claim Funds</p>
          )}
        </CustomButton>
      ) : null}

      {canDeleteAccount ? (
        <CustomButton
          title="Close Account"
          onClick={onClickDeleteCampaignAccount}
          customCss="w-[200px]"
        >
          {isCloseAccountProcessing ? (
            <div className="w-6 h-6 animate-spin rounded-full border-dashed border-6 border-white" />
          ) : (
            <p>Close account</p>
          )}
        </CustomButton>
      ) : null}
    </div>
  );
};

export default ButtonsComponent;
