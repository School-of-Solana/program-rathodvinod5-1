"use client";
import { useRouter } from "next/navigation";

import useCreateCampaign from "./useCreateCampaign";

const CreateCampaign = () => {
  const {
    campaignName,
    onChangeCampaignName,
    campaignDescription,
    onChangeCampaignDescription,
    goalAmount,
    onChangeGoalAmount,
    deadline,
    onChangeDeadline,
    clearFormData,
  } = useCreateCampaign();

  const router = useRouter();

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="w-[60%] mt-[100px]">
        <h2>New Campaign</h2>

        <div className="my-4">
          <label>Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={onChangeCampaignName}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
        </div>

        <div className="my-4">
          <label>Description</label>
          <textarea
            // placeholder="Description"
            value={campaignDescription}
            onChange={onChangeCampaignDescription}
            className="border border-teal-600 p-2 rounded w-full"
          />
        </div>

        <div className="my-4">
          <label>Target Amount</label>
          <input
            type="number"
            placeholder="In Lamports"
            value={goalAmount}
            // onChange={(e) => setGoal(e.target.value)}
            onChange={onChangeGoalAmount}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
        </div>

        <div className="my-4">
          <label>Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            // onChange={(e) => setDeadline(e.target.value)}
            onChange={onChangeDeadline}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
        </div>

        <div className="flex flex-row justify-end items-center mt-6 gap-4">
          <button
            className="cursor-pointer bg-teal-700 rounded px-4 py-2 text-white"
            onClick={clearFormData}
          >
            Clear
          </button>
          <button
            className="cursor-pointer bg-teal-700 rounded px-4 py-2 text-white"
            onClick={() => router.push("/create")}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
