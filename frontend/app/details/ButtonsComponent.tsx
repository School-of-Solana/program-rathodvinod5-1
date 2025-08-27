"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomButton from "../components/Button";
import useCreateCampaign from "../create/useCreateCampaign";

const ButtonsComponent = ({
  campaignPublicKey,
  onClickContributeButton,
  onClickClaimButton,
}: {
  campaignPublicKey?: string;
  onClickContributeButton?: () => void;
  onClickClaimButton?: () => void;
}) => {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { isProcessing, contributToCampaign } = useCreateCampaign();

  const isCreator = (() => {
    let pubKey = JSON.stringify(campaignPublicKey);
    pubKey = pubKey.replace(/"/g, "");
    console.log("pubKey: ", pubKey);
    return pubKey === publicKey?.toString();
  })();

  console.log("isCreator", isCreator);

  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <CustomButton
        title="Contribute"
        // route="/details/${campaign}"
        onClick={onClickContributeButton}
        customCss="w-[200px]"
      >
        {!isProcessing ? (
          <p>Contribute</p>
        ) : (
          <div className="w-8 h-8 animate-spin rounded-full border-dashed border-8 border-white"></div>
        )}
      </CustomButton>
      {/* <CustomButton
        title="Claim Funds"
        // route="/details/${campaign}"
        onClick={() => {}}
        customCss="w-[200px]"
      /> */}
      {isCreator ? (
        <CustomButton
          title="Claim Funds"
          onClick={() => {}}
          customCss="w-[200px]"
        >
          {!isProcessing ? (
            <p>Claim Funds</p>
          ) : (
            <div className="w-10 h-10 animate-spin rounded-full border-dashed border-8 border-[#3b9df8]"></div>
          )}
        </CustomButton>
      ) : null}
    </div>
  );
};

export default ButtonsComponent;
