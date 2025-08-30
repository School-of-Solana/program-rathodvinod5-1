"use client";
import { useCampaignsContext } from "@/app/context/CampaignContext";
import ButtonsComponent from "../ButtonsComponent";
import { useParams } from "next/navigation";
import {
  formatTimestamp,
  lamportsToSol,
} from "@/app/utilities/HelperFunctions";
import ProgressBar from "@/app/components/ProgressBar";
import useCreateCampaign from "@/app/create/useCreateCampaign";
import { PublicKey } from "@solana/web3.js";
import Alert from "@/app/components/Alert";
import { CloseAccountTypeEnum } from "@/app/utilities/Contants";

const CampaignDetails = () => {
  const { campaigns } = useCampaignsContext();
  const {
    isContributionProcessing,
    isClaimFundsProcessing,
    contributionStatus,
    claimFundsStatus,
    goalAmount,
    contributionAccountDetails,
    closeAlertTypeStatus,
    onChangeGoalAmount,
    contributToCampaign,
    claimFunds,
    isClaimRefundProcessing,
    claimRefundStatus,
    claimRefunds,
  } = useCreateCampaign();

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
    if (!isCampaignActive) return;
    contributToCampaign(new PublicKey(campaign!));
  };

  const onClickClaimFundsButton = () => {
    console.log("onClickClaimFundsButton");
    claimFunds(
      new PublicKey(campaign!),
      campaignDetails.account.creator as PublicKey
    );
  };

  const onClickClaimRefundButton = () => {
    if (contributionAccountDetails?.totalAmountDonated.toString() > 0) {
      claimRefunds(
        new PublicKey(campaign!),
        contributionAccountDetails?.contributor as PublicKey
      );
    }
  };

  let isCampaignActive = false;
  if (campaignDetails?.account?.deadline) {
    const deadlineInString = new Date(
      campaignDetails?.account?.deadline * 1000
    );
    const dateNow = new Date();

    isCampaignActive = dateNow < deadlineInString;
  }
  // console.log("isCampaignActive", isCampaignActive, dateNow, deadlineInString);
  const previousContributionAmount =
    contributionAccountDetails?.totalAmountDonated.toString();

  if (!campaignDetails) return null;

  return (
    <div className="px-[180px]">
      {contributionStatus ? (
        <Alert
          status={contributionStatus}
          onCloseHandler={() =>
            closeAlertTypeStatus(CloseAccountTypeEnum.CONTRIBUTION)
          }
        />
      ) : null}

      {claimFundsStatus ? (
        <Alert
          status={claimFundsStatus}
          onCloseHandler={() =>
            closeAlertTypeStatus(CloseAccountTypeEnum.CLAIM_FUNDS)
          }
        />
      ) : null}

      {claimRefundStatus ? (
        <Alert
          status={claimRefundStatus}
          onCloseHandler={() =>
            closeAlertTypeStatus(CloseAccountTypeEnum.CLAIM_REFUND)
          }
        />
      ) : null}

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
            {campaignDetails.account.goalAmount.toString()} lamports
          </span>{" "}
          /{" "}
          <span className="font-bold">
            {lamportsToSol(campaignDetails.account.goalAmount.toString())} sol
          </span>
        </p>
        <p className="my-2 text-gray-700">
          Total raised:{" "}
          <span className="font-bold">
            {campaignDetails.account.totalDonated.toString()} lamports
          </span>{" "}
          /{" "}
          <span className="font-bold">
            {lamportsToSol(campaignDetails.account.totalDonated.toString())} sol
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

        {isCampaignActive ? (
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
        ) : null}

        <ButtonsComponent
          campaignPublicKey={campaignDetails.account.creator as string}
          isContributionProcessing={isContributionProcessing}
          isClaimFundsProcessing={isClaimFundsProcessing}
          isClaimRefundProcessing={isClaimRefundProcessing}
          onClickContributeButton={onClickContributeButton}
          onClickClaimButton={onClickClaimFundsButton}
          onClickClaimRefundButton={onClickClaimRefundButton}
          isCampaignActive={isCampaignActive}
          previousContributionAmount={previousContributionAmount}
        />
      </div>

      {Number(previousContributionAmount) > 0 ? (
        <div className="mt-4">
          <p>
            Your previous Contributions:{" "}
            <b>{previousContributionAmount} lamports</b>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CampaignDetails;
