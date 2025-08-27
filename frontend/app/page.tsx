"use client";
import { useRouter, usePathname } from "next/navigation";

import CustomButton from "./components/Button";
import { CampaignType } from "./types/Types";
import ProgressBar from "./components/ProgressBar";
import { formatTimestamp } from "./utilities/HelperFunctions";
import { useCampaignsContext } from "./context/CampaignContext";

export default function Home() {
  const { campaigns } = useCampaignsContext();

  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-row justify-between items-center">
        <p>Campaign List</p>
        <button
          className="cursor-pointer bg-teal-700 rounded px-4 py-2 text-white"
          onClick={() => router.push("/create")}
        >
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {campaigns &&
          campaigns?.map((campaign) => {
            return (
              <div
                key={campaign}
                className="w-[280px] h-fit border border-teal-600 p-4 rounded-md break-all "
              >
                <p className="font-bold text-lg my-2 capitalize">
                  {campaign.account.title}
                </p>

                <p className="text-gray-700 font-semibold capitalize">
                  {campaign.account.description}
                </p>
                <p className="text-gray-700 mt-4">
                  Target amount: {campaign.account.goalAmount.toString()} sol
                </p>
                <p className="my-2 text-gray-700">
                  Total raised {campaign.account.totalDonated.toString()} sol
                </p>
                <ProgressBar
                  current={campaign.account.totalDonated.toString()}
                  total={campaign.account.goalAmount.toString()}
                />
                <p>
                  Deadline -{" "}
                  {formatTimestamp(campaign.account.deadline.toString())}
                </p>
                <CustomButton
                  title="View Details"
                  route={`/details/${campaign.publicKey.toString()}`}
                  // onClick={() => router.push(`/details/${campaign}`)}
                >
                  View Details
                </CustomButton>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// Hd8Hcqi261cs426afPUFzfhUuDGg3XEiUqvpo7oADEgF
