"use client";
import Alert from "../components/Alert";
import CustomButton from "../components/Button";
import { useOverlay } from "../context/ModalContext";
import { CloseAccountTypeEnum } from "../utilities/Contants";

import useCreateCampaign from "./useCreateCampaign";

const CreateCampaign = () => {
  const {
    isCreateCampaignProcessing,
    createCampaignStatus,
    campaignName,
    formInputError,
    onChangeCampaignName,
    campaignDescription,
    onChangeCampaignDescription,
    goalAmount,
    onChangeGoalAmount,
    deadline,
    onChangeDeadline,
    clearFormData,
    handleCreateCampaign,
    closeAlertTypeStatus,
  } = useCreateCampaign();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {createCampaignStatus ? (
        <Alert
          status={createCampaignStatus}
          onCloseHandler={() =>
            closeAlertTypeStatus(CloseAccountTypeEnum.CREATE_CAMPAIGN)
          }
        />
      ) : null}

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
          {formInputError?.campaignName && (
            <p className="text-[#d74242] text-[12px] dark:text-red-500">
              {formInputError.campaignName}
            </p>
          )}
        </div>

        <div className="my-4">
          <label>Description</label>
          <textarea
            value={campaignDescription}
            onChange={onChangeCampaignDescription}
            className="border border-teal-600 p-2 rounded w-full"
          />
          {formInputError?.campaignDescription && (
            <p className="text-[#d74242] text-[12px] dark:text-red-500">
              {formInputError.campaignDescription}
            </p>
          )}
        </div>

        <div className="my-4">
          <label>Target Amount</label>
          <input
            type="number"
            placeholder="In Lamports"
            value={goalAmount}
            onChange={onChangeGoalAmount}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
          {formInputError?.goalAmount && (
            <p className="text-[#d74242] text-[12px] dark:text-red-500">
              {formInputError.goalAmount}
            </p>
          )}
        </div>

        <div className="my-4">
          <label>Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={onChangeDeadline}
            className="border border-teal-600 p-2 rounded w-full"
            required
          />
          {formInputError?.deadline && (
            <p className="text-[#d74242] text-[12px] dark:text-red-500">
              {formInputError.deadline}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-end items-center mt-6 gap-4">
          <CustomButton
            // title="Claim Funds"
            onClick={clearFormData}
            customCss="w-[200px]"
          >
            <p>Clear</p>
          </CustomButton>
          <CustomButton
            // title="Claim Funds"
            onClick={handleCreateCampaign}
            customCss="w-[220px]"
          >
            {isCreateCampaignProcessing ? (
              <div className="w-6 h-6 animate-[spin_1s_linear_infinite] rounded-full border-4 border-r-[#3B9DF8] border-white" />
            ) : (
              <p>Create Campaign</p>
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
