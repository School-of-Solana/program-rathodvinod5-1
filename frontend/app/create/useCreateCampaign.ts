"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@project-serum/anchor";
import { AnchorError } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getCampaignPDA,
  getContributionPDA,
} from "../utilities/HelperFunctions";
import {
  CloseAccountTypeEnum,
  ErrorMessage,
  // OPTS,
  SuccessAndErrorType,
  SuccessMessage,
} from "../utilities/Contants";
import { useAnchor } from "../context/SolanaConnectionProgramProvider";
import { useCampaignsContext } from "../context/CampaignContext";
import {
  ContributionAccountType,
  FormInputErrorTypes,
  SuccessAndErrorDetailsType,
} from "../types/Types";
import { useParams, useRouter } from "next/navigation";
import { useOverlay } from "../context/ModalContext";

const useCreateCampaign = () => {
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setDescription] = useState<string>("");
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const [formInputError, setFormInputErrors] =
    useState<FormInputErrorTypes | null>(null);

  const [contributionAccountDetails, setContributionAccountDetails] =
    useState<ContributionAccountType | null>(null);

  // create campaign specific
  const [isCreateCampaignProcessing, setIsCreateCampaignProcessing] =
    useState<boolean>(false);
  const [createCampaignStatus, setCreateCampaignStatus] =
    useState<SuccessAndErrorDetailsType | null>(null);

  // contribution specific
  const [isContributionProcessing, setIsContributionProcessing] =
    useState<boolean>(false);
  const [contributionStatus, setContributionStatuss] =
    useState<SuccessAndErrorDetailsType | null>(null);

  // claim funds specific
  const [isClaimFundsProcessing, setIsClaimFundsProcessing] =
    useState<boolean>(false);
  const [claimFundsStatus, setClaimFundsStatus] =
    useState<SuccessAndErrorDetailsType | null>(null);

  // claim refunds specific
  const [isClaimRefundProcessing, setIsClaimRefundProcessing] =
    useState<boolean>(false);
  const [claimRefundStatus, setClaimRefundStatus] =
    useState<SuccessAndErrorDetailsType | null>(null);

  const [isCloseAccountProcessing, setIsCloseAccountProcessing] =
    useState<boolean>(false);
  const [closeAccountStatus, setCloseAccountStatus] =
    useState<SuccessAndErrorDetailsType | null>(null);

  // const { program } = useProgram();
  const { program, connection } = useAnchor();
  const { fetchCampaigns } = useCampaignsContext();
  const { showAlert, isAlertOpen } = useOverlay();
  const router = useRouter();

  const wallet = useWallet(); // ✅ full wallet object (with publicKey + signTransaction)

  const params = useParams();
  let { campaign } = params;

  useEffect(() => {
    if (campaign) {
      fetchDetailsOfContribution(new PublicKey(campaign));
    }
  }, [campaign, wallet]);

  const onChangeCampaignName = (event: ChangeEvent<HTMLInputElement>) =>
    setCampaignName(event.target.value);

  const onChangeCampaignDescription = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setDescription(event.target.value);

  const onChangeGoalAmount = (event: ChangeEvent<HTMLInputElement>) =>
    setGoalAmount(event.target.value);

  const onChangeDeadline = (event: ChangeEvent<HTMLInputElement>) =>
    setDeadline(event.target.value);

  const fetchDetailsOfContribution = async (campaignPubkey: PublicKey) => {
    console.log("fetchDetailsOfContribution");
    if (!wallet.publicKey || !program) {
      // if (!wallet.publicKey) {
      //   showAlert("Wallet not connected");
      // }
      return;
    }

    const [contributionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("contributor"),
        campaignPubkey.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    try {
      const contributionAccount = await program.account.contribution.fetch(
        contributionPda
      );

      // ✅ PDA exists → user has contributed before
      console.log(
        "Total donated so far:",
        contributionAccount.totalAmountDonated.toString()
      );
      setContributionAccountDetails(
        contributionAccount as ContributionAccountType
      );
    } catch (err) {
      // ❌ PDA doesn't exist → user has not contributed yet
      console.log("No previous contribution found");
    }
  };

  const validateCreateForm = () => {
    const newFormInputError: FormInputErrorTypes = {
      campaignName: "",
      campaignDescription: "",
      goalAmount: "",
      deadline: "",
    };
    let isError = false;
    if (!campaignName || typeof campaignName !== "string") {
      newFormInputError.campaignName = "Please enter a valid campaign name.";
      isError = true;
    }
    if (!campaignDescription || typeof campaignDescription !== "string") {
      newFormInputError.campaignDescription =
        "Please enter a valid campaign description.";
      isError = true;
    }
    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      newFormInputError.goalAmount = "Please enter a valid goal amount.";
      isError = true;
    }
    if (!deadline || new Date(deadline).getTime() <= new Date().getTime()) {
      newFormInputError.deadline = "Please enter a valid deadline.";
      isError = true;
    }
    setFormInputErrors(newFormInputError);
    return !isError;
  };

  const handleCreateCampaign = async () => {
    console.log("handleCreateCampaign");
    setFormInputErrors(null);
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      showAlert("Wallet not connected");
      return;
    }

    if (!validateCreateForm()) return;

    try {
      setIsCreateCampaignProcessing(true);

      // ✅ Convert inputs
      const goalLamports = new BN(goalAmount); // Keep in lamports for now
      const deadlineUnix = new BN(
        Math.floor(new Date(deadline).getTime() / 1000)
      );

      // ✅ Derive PDA
      const campaignPDA = getCampaignPDA(wallet.publicKey, campaignName);

      // ✅ Send TX
      const txSig = await program?.methods
        .initCampaign(
          campaignName,
          campaignDescription,
          goalLamports,
          deadlineUnix
        )
        .accounts({
          signer: wallet.publicKey,
          campaign: campaignPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Campaign created with tx:", txSig);
      console.log("📍 Campaign PDA:", campaignPDA.toBase58());
      setCreateCampaignStatus({
        type: SuccessAndErrorType.SUCCESS,
        message: SuccessMessage.CAMPAIGN_CREATED_SUCCESSFULLY,
      });
      fetchCampaigns();
      clearFormData();
    } catch (err) {
      console.error("❌ Failed to create campaign:", err);

      if (err instanceof AnchorError) {
        setCreateCampaignStatus({
          type: SuccessAndErrorType.ERROR,
          title: err.error.errorCode.code,
          message: err.error.errorMessage,
        });
      } else {
        setCreateCampaignStatus({
          type: SuccessAndErrorType.ERROR,
          message: ErrorMessage.FAILED_TO_CREATE_CAMPAIGN,
        });
      }
    } finally {
      setIsCreateCampaignProcessing(false);
    }
  };

  const contributToCampaign = async (campaignPda: PublicKey) => {
    console.log("contributToCampaign");

    const newFormInputError: FormInputErrorTypes = {
      goalAmount: "",
    };
    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      newFormInputError.goalAmount = "Please enter a valid goal amount.";
      setFormInputErrors(newFormInputError);
      return;
    }

    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      showAlert("Wallet not connected");
      return;
    }

    if (!goalAmount && Number(goalAmount) > 0) {
      alert("Please enter a valid contribution amount.");
      return;
    }

    try {
      setIsContributionProcessing(true);

      // ✅ Convert inputs
      const goalLamports = new BN(goalAmount);
      const contributionPda = getContributionPDA(campaignPda, wallet.publicKey);

      const txSig = await program?.methods
        .contributeAmount(goalLamports)
        .accounts({
          signer: wallet.publicKey,
          campaign: campaignPda,
          contirbution: contributionPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      // console.log("✅ Contributed to campaign with tx:", txSig);
      console.log("📍 Contribution PDA:", contributionPda.toBase58());
      setContributionStatuss({
        type: SuccessAndErrorType.SUCCESS,
        message: SuccessMessage.CONTRIBUTION_SUCCESSFULL,
      });
      // fetchDetailsOfCampaingAccount(campaignPda);
      fetchCampaigns();
      clearFormData();
    } catch (err) {
      console.error("❌ Failed to contribute to campaign:", err);
      if (err instanceof AnchorError) {
        setContributionStatuss({
          type: SuccessAndErrorType.ERROR,
          title: err.error.errorCode.code,
          message: err.error.errorMessage,
        });
      } else {
        setContributionStatuss({
          type: SuccessAndErrorType.ERROR,
          message: ErrorMessage.FAILED_TO_CONTRIBUTE,
        });
      }
    } finally {
      setIsContributionProcessing(false);
    }
  };

  const claimFunds = async (campaignPda: PublicKey, creator: PublicKey) => {
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      showAlert("Wallet not connected");
      return;
    }

    if (wallet?.publicKey.toBase58() !== creator.toBase58()) {
      console.error("⚠️ You are not the creator of this campaign");
      return;
    }

    try {
      setIsClaimFundsProcessing(true);

      const txSig = await program?.methods
        .claimFundByAuthor()
        .accounts({
          signer: wallet.publicKey,
          campaign: campaignPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Claimed funds with tx:", txSig);
      fetchCampaigns();
      clearFormData();
      setClaimFundsStatus({
        type: SuccessAndErrorType.SUCCESS,
        message: SuccessMessage.FUNDS_CLAIMED_SUCCESSFULLY,
      });
    } catch (err) {
      console.error("❌ Failed to claim funds:", err);
      if (err instanceof AnchorError) {
        setClaimFundsStatus({
          type: SuccessAndErrorType.ERROR,
          title: err.error.errorCode.code,
          message: err.error.errorMessage,
        });
      } else {
        setClaimFundsStatus({
          type: SuccessAndErrorType.ERROR,
          message: ErrorMessage.CLAIM_FUNDS_FAILED,
        });
      }
    } finally {
      setIsClaimFundsProcessing(false);
    }
  };

  const claimRefunds = async (campaignPda: PublicKey, creator: PublicKey) => {
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      showAlert("Wallet not connected");
      return;
    }

    // if (wallet?.publicKey.toBase58() !== creator.toBase58()) {
    //   console.error("⚠️ You are not the creator of this campaign");
    //   return;
    // }

    try {
      setIsClaimRefundProcessing(true);

      const contributionPda = getContributionPDA(campaignPda, creator);

      const txSig = await program?.methods
        .refundToContributor()
        .accounts({
          contributor: wallet.publicKey,
          campaign: campaignPda,
          constribution: contributionPda,
          // systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // console.log("✅ Claimed funds with tx:", txSig);
      fetchCampaigns();
      clearFormData();
      setContributionAccountDetails(null);
      setClaimRefundStatus({
        type: SuccessAndErrorType.SUCCESS,
        message: SuccessMessage.FUNDS_CLAIMED_SUCCESSFULLY,
      });
    } catch (err) {
      console.error("❌ Failed to claim funds:", err);
      if (err instanceof AnchorError) {
        setClaimRefundStatus({
          type: SuccessAndErrorType.ERROR,
          title: err.error.errorCode.code,
          message: err.error.errorMessage,
        });
      } else {
        setClaimRefundStatus({
          type: SuccessAndErrorType.ERROR,
          message: ErrorMessage.CLAIM_FUNDS_FAILED,
        });
      }
    } finally {
      setIsClaimRefundProcessing(false);
    }
  };

  const deleteCampaignAccount = async (campaignPda: PublicKey) => {
    if (!wallet.publicKey) {
      console.error("⚠️ Wallet not connected");
      showAlert("Wallet not connected");
      return;
    }

    // const campaignPDA = getCampaignPDA(wallet.publicKey, campaignName);

    try {
      setIsCloseAccountProcessing(true);
      const txSig = await program?.methods
        .closeCampaign()
        .accounts({
          creator: wallet.publicKey,
          campaign: campaignPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ Campaign created with tx:", txSig);
      fetchCampaigns();
      router.push("/");
    } catch (error) {
      console.log("Error while deleting account: ", error);
    } finally {
      setIsCloseAccountProcessing(false);
    }
  };

  const closeAlertTypeStatus = (status: CloseAccountTypeEnum) => {
    if (status === CloseAccountTypeEnum.CREATE_CAMPAIGN) {
      setIsCreateCampaignProcessing(false);
      setCreateCampaignStatus(null);
    } else if (status === CloseAccountTypeEnum.CONTRIBUTION) {
      setIsContributionProcessing(false);
      setContributionStatuss(null);
    } else if (status === CloseAccountTypeEnum.CLAIM_FUNDS) {
      setIsClaimFundsProcessing(false);
      setClaimFundsStatus(null);
    } else if (status === CloseAccountTypeEnum.CLAIM_REFUND) {
      setIsClaimRefundProcessing(false);
      setClaimRefundStatus(null);
    }
  };

  const clearFormData = () => {
    setFormInputErrors(null);
    setCampaignName("");
    setDescription("");
    setGoalAmount("");
    setDeadline("");
  };

  return {
    campaignName,
    campaignDescription,
    goalAmount,
    deadline,
    isCreateCampaignProcessing,
    createCampaignStatus,
    isContributionProcessing,
    contributionStatus,
    isClaimFundsProcessing,
    claimFundsStatus,
    isClaimRefundProcessing,
    claimRefundStatus,
    isCloseAccountProcessing,
    formInputError,
    contributionAccountDetails,
    onChangeCampaignName,
    onChangeCampaignDescription,
    onChangeGoalAmount,
    onChangeDeadline,
    handleCreateCampaign,
    clearFormData,
    contributToCampaign,
    claimFunds,
    closeAlertTypeStatus,
    fetchDetailsOfContribution,
    claimRefunds,
    deleteCampaignAccount,
  };
};

export default useCreateCampaign;

// Hd8Hcqi261cs426afPUFzfhUuDGg3XEiUqvpo7oADEgF
