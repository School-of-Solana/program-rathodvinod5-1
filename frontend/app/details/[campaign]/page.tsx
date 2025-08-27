"use client";
import { useCampaignsContext } from "@/app/context/CampaignContext";
import ButtonsComponent from "../ButtonsComponent";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { formatTimestamp } from "@/app/utilities/HelperFunctions";
import ProgressBar from "@/app/components/ProgressBar";
import useCreateCampaign from "@/app/create/useCreateCampaign";
import { PublicKey } from "@solana/web3.js";

const CampaignDetails = () => {
  const { campaigns } = useCampaignsContext();
  const { isProcessing, goalAmount, onChangeGoalAmount, contributToCampaign } =
    useCreateCampaign();

  const params = useParams();
  let { campaign } = params;

  if (!campaigns) return null;
  campaign = campaign?.toString();

  const campaignDetails = campaigns?.find((c) => {
    let campignPublicKey = JSON.stringify(c.publicKey);
    campignPublicKey = campignPublicKey.replace(/"/g, "");
    return campignPublicKey == campaign;
  });

  const onClickContributeButton = () => {
    console.log("onClickContributeButton");
    contributToCampaign(new PublicKey(campaign!));
  };

  return (
    <div className="px-[180px]">
      <div className="w-full h-fit border border-teal-600 p-4 rounded-md mt-[60px]">
        <p className="font-bold text-lg my-2 capitalize">
          {campaignDetails.account.title}
        </p>

        <p className="text-gray-700 font-semibold capitalize">
          {campaignDetails.account.description}
        </p>
        <p className="text-gray-700 mt-4">
          Target amount:{" "}
          <span className="font-bold">
            {campaignDetails.account.goalAmount.toString()} sol
          </span>
        </p>
        <p className="my-2 text-gray-700">
          Total raised:{" "}
          <span className="font-bold">
            {campaignDetails.account.totalDonated.toString()} sol
          </span>
        </p>
        <ProgressBar
          current={campaignDetails.account.totalDonated.toString()}
          total={campaignDetails.account.goalAmount.toString()}
        />
        <p className="my-2 text-gray-700">
          Deadline -{" "}
          {formatTimestamp(campaignDetails.account.deadline.toString())}
        </p>

        <div className="my-4">
          <label className="my-2 text-gray-700">Contribution Amount</label>
          <input
            type="number"
            placeholder="In Lamports"
            value={goalAmount}
            onChange={onChangeGoalAmount}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
        </div>

        <ButtonsComponent
          campaignPublicKey={campaignDetails.account.creator as string}
          onClickContributeButton={onClickContributeButton}
        />
      </div>
    </div>
  );
};

export default CampaignDetails;
