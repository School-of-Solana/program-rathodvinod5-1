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
