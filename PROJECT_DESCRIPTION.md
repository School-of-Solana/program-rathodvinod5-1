# Project Description

**Deployed Frontend URL:** https://solana-crowdfunding-8rptlri5n-vinod-rathods-projects.vercel.app

**Solana Program ID:** Ept1VxEScf1bzfkwfEous1ZCDj16QCirBBq9kXzYAgwG

## Project Overview

### Description

Solana Fundraiser is a decentralized crowdfunding application built on the Solana blockchain using the Anchor framework. The project enables creators to launch fundraising campaigns where contributors can donate SOL to support ideas, products, or causes. Unlike traditional crowdfunding platforms, this dApp eliminates intermediaries, ensuring transparency and trust by leveraging Solana’s fast, low-cost, and secure transactions.

The application supports:

- Creating and managing campaigns directly on-chain.
- Contributing SOL to campaigns with instant confirmation.
- Allowing multiple contributions from the same wallet to the same campaign.
- Secure campaign fund withdrawal by the campaign owner.
- Users can withdraw their contribution amount if the goal of the campaign is not met

### Key Features

- **Featuer 1: Create and Manage Campaigns**

  Campaign creators can easily launch new fundraising campaigns directly on the Solana blockchain. Each campaign includes essential metadata such as title, description, funding goal, and deadline.

- **Featuer 2: Contribute SOL to Campaigns**

  Users can contribute SOL to any active campaign with instant confirmation, thanks to Solana’s high throughput and low transaction fees. Contributions are recorded securely on-chain.

- **Featuer 3: Multiple Contributions from the Same Wallet**

  A single wallet can contribute multiple times to the same campaign, allowing supporters to increase their contributions over time.

- **Featuer 4: Secure Fund Withdrawal by Campaign Owner**

  Once a campaign reaches its funding goal before the deadline, only the campaign creator is authorized to withdraw the funds securely.

- **Featuer 5: Refunds if Goal is Not Met**

  If a campaign fails to meet its funding goal by the deadline, contributors are able to withdraw their contributions, ensuring fairness and trust in the fundraising process.

### How to Use the dApp

1. **Connect Wallet**
2. **Create a Campaign:** Enter details like campaign title, description, funding goal, and deadline, and confirm the transaction to deploy your campaign on-chain
3. **Browse Active Campaigns:** After creating a campaign, view a list of all ongoing campaigns with their progress, goal, and remaining time on the homepage.
4. **Contribute to a Campaign:** Select any campaign you want to support, Enter the amount of SOL to contribute and approve the transaction, press contribute button and your contribution is instantly reflected in the campaign progress.
5. **Make Multiple Contributions:** If desired, contribute more than once to the same campaign using the same wallet.
6. **Withdraw Funds (For Campaign Owners):** If the funding goal is met, after the deadline, the campaign owner can withdraw the collected funds.
7. **Refund Contributions (For Supporters):** If the campaign fails to reach its goal, contributors can withdraw their SOL back securely.

## Program Architecture

# Main Instructions

- Initialize Campaign with

  - Creates and initializes a new CampaignAccount.
  - Saves metadata: owner, goal, deadline, title, description.

- Contribute

  - Allows any user to transfer SOL to a campaign.
  - Updates total_donated in CampaignAccount.
  - If contributor already exists, their contributed_amount is incremented.

- Withdraw by owner

  - On success, lamports from CampaignAccount are transferred to owner’s wallet.
  - Program ensures conditions (goal met, deadline not passed, not already withdrawn).

- Refund (Contributor)

  - If goal not met after deadline, contributor requests refund.
  - Program verifies contribution record and transfers SOL back to contributor.

### PDA Usage

**PDAs Used:**

**1. Campaign Account PDA seeds** - `[b"campaign", signer.key().as_ref(), title.as_bytes()]`

- b"campaign" (a static seed for namespace)
- signer (the wallet address of the campaign creator)
- title of the campaign

- Reason:
  These seeds ensure that every campaign has a unique PDA, even if created by the same user multiple times. This avoids overwriting existing campaign accounts and keeps data well organized.

**2. Contribution Account PDA** - `[b"contributor", campaign.key().as_ref(), contributor.key().as_ref()]`

- b"contribution" (a static seed for namespace)
- campaign (the PDA of the campaign being contributed to)
- contributor (the wallet address of the contributor)

- Reason:
  Using both the campaign PDA and the contributor’s wallet address ties the contribution account directly to the campaign and contributor.

### Program Instructions

1. **InitializeCampaign:** `initialize_campaign(ctx, title, description, goal, deadline)` - to create a new campaign.

2. **Contribute:** `contribute_amount(amount: u64)` to contribute to the campaign

3. **Withdraw by owner:** `claim_fund_by_author()`

4. **Refund (Contributor):** `refund_to_contributor()`

5. **Re-Contribute:** `recontribute_amount(amount: u64)` to re-contribute to the campaign

**Instructions Implemented:**

- **InitializeCampaign**: Creates and initializes a new CampaignAccount and saves metadata: owner, goal, deadline, title, description.
- **Contribute**: Users can transfer SOL to a campaign via contribute_amount() instruction. and the total total_donated sol will be updated in CampaignAccount.
- **Withdraw by owner**: On successfully raising the target amount, the owner can withdraw lamports from the campaign account only after the deadline. Trying before the deadline will raise an error.
- **Refund (Contributor)**: If the goal not met after the deadline, the contributors can request for refund, and withdraw the deposited lamports.
- **Re-Contribute**: A user can contribute to the same campaign multiple times

### Account Structure

```rust
// Campaign account structure
pub struct Campaign {
    pub creator: Pubkey, // PublicKey of the campaign creator
    #[max_len(30)]
    pub title: String, // Campaign title
    #[max_len(50)]
    pub description: String, // Description of the campaing
    pub goal_amount: u64, // target amount to be raised
    pub total_donated: u64, // total donations made by contributors
    pub deadline: i64, // deadline of the campaign in time
    pub bump: u8, // bump which is calculated
    pub claimed: bool, // indicated does the amount of the campaing is claimed by the creator
}

// Contribution account structure
pub struct Contribution {
    pub campaign: Pubkey, // pub key of the campaign
    pub contributor: Pubkey, // pub key of the contributor
    pub total_amount_donated: u64, // total amount donated by this user
}
```

## Testing

### Test Coverage

All the test cases are in a single file. Run "anchor test" to run happy and unhappy case at the same time.
Note: The path of the test cases is "anchor_project/crowdfunding"

### Running Tests

```bash
# Commands to run your tests
cd anchor_project/crowdfunding && anchor test
```

### Additional Notes for Evaluators

### Please Note:-

1. Path for solana anchor program code is "anchor_project/crowdfunding"

   - And please run anchor related command from "anchor_project/crowdfunding" dir only

```bash
# Anchor related command to be run from "anchor_project/crowdfunding dir only
cd anchor_project/crowdfunding && anchor build
cd anchor_project/crowdfunding && anchor test
```

2. Path for frontend code "frontend" (NextJS project)
   - And please run front-end related command from "frontend" dir only

```bash
# NextJS related command to be run from "frontend dir only
cd frontend && npm run dev
cd frontend && npm run start
```
