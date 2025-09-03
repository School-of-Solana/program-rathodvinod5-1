# Project Description

**Deployed Frontend URL:** [TODO: Link to your deployed frontend]

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

- Featuer 1: Create and Manage Campaigns
  Campaign creators can easily launch new fundraising campaigns directly on the Solana blockchain. Each campaign includes essential metadata such as title, description, funding goal, and deadline.

- Featuer 2: Contribute SOL to Campaigns
  Users can contribute SOL to any active campaign with instant confirmation, thanks to Solana’s high throughput and low transaction fees. Contributions are recorded securely on-chain.

- Featuer 3: Multiple Contributions from the Same Wallet
  A single wallet can contribute multiple times to the same campaign, allowing supporters to increase their contributions over time.

- Featuer 4: Secure Fund Withdrawal by Campaign Owner
  Once a campaign reaches its funding goal before the deadline, only the campaign creator is authorized to withdraw the funds securely.

- Featuer 5: Refunds if Goal is Not Met
  If a campaign fails to meet its funding goal by the deadline, contributors are able to withdraw their contributions, ensuring fairness and trust in the fundraising process.

### How to Use the dApp

[TODO: Provide step-by-step instructions for users to interact with your dApp]

1. **Connect Wallet**
2. **Create a Campaign:** Enter details like campaign title, description, funding goal, and deadline, and confirm the transaction to deploy your campaign on-chain
3. **Browse Active Campaigns:** After creating a campaign, view a list of all ongoing campaigns with their progress, goal, and remaining time on the homepage.
4. **Contribute to a Campaign:** Select any campaign you want to support, Enter the amount of SOL to contribute and approve the transaction, press contribute button and your contribution is instantly reflected in the campaign progress.
5. **Make Multiple Contributions:** If desired, contribute more than once to the same campaign using the same wallet.
6. **Withdraw Funds (For Campaign Owners):** If the funding goal is met, after the deadline, the campaign owner can withdraw the collected funds.
7. **Refund Contributions (For Supporters):** If the campaign fails to reach its goal, contributors can withdraw their SOL back securely.

## Program Architecture

1. Account Structure

- Account Structures

  - Campaign Account

    - Stores the state of each crowdfunding campaign.
    - Fields include:
      - owner: PublicKey of the campaign creator.
      - title: Campaign title.
      - description: Campaign details.
      - goal_amount: The SOL target to be raised.
      - deadline: Campaign end timestamp.
      - total_donated: Current SOL collected.
      - claimed: is campaign money cliamed by creator

  - Contribution Account
    - used if you want to track each contributor’s state separately.
    - Fields include:
      - campaign: The campaign PublicKey.
      - contributor: Wallet address.
      - total_amount_donated: Total amount contributed by this wallet to this campaign.

2. Main Instructions

- Initialize Campaign with
  "initialize_campaign(ctx: Context<InitializeCampaign>, title: String, description: String, goal_amount: u64, deadline: i64)"

  - Creates and initializes a new CampaignAccount.
  - Saves metadata: owner, goal, deadline, title, description.

- Contribute
  "contribute(ctx: Context<Contribute>, amount: u64)"

  - Allows any user to transfer SOL to a campaign.
  - Updates total_donated in CampaignAccount.
  - If contributor already exists, their contributed_amount is incremented.

- Withdraw by owner
  "claim_funds(ctx: Context<ClaimFunds>)"

  - On success, lamports from CampaignAccount are transferred to owner’s wallet.
  - Program ensures conditions (goal met, deadline not passed, not already withdrawn).

- Refund (Contributor)
  "refund(ctx: Context<Refund>)"

  - If goal not met after deadline, contributor requests refund.
  - Program verifies contribution record and transfers SOL back to contributor.

### PDA Usage

**PDAs Used:**

1. Campaign Account PDA
   Seeds used: "seeds = [b"campaign", signer.key().as_ref(), title.as_bytes()]"

   - b"campaign" (a static seed for namespace)
   - signer (the wallet address of the campaign creator)
   - title of the campaign

   - Reason:
     These seeds ensure that every campaign has a unique PDA, even if created by the same user multiple times. This avoids overwriting existing campaign accounts and keeps data well organized.

2. Contribution Account PDA
   Seeds used: "seeds = [b"contributor", campaign.key().as_ref(), contributor.key().as_ref()]"

   - b"contribution" (a static seed for namespace)
   - campaign (the PDA of the campaign being contributed to)
   - contributor (the wallet address of the contributor)

   - Reason:
     Using both the campaign PDA and the contributor’s wallet address ties the contribution account directly to the campaign and contributor.

### Program Instructions

1. InitializeCampaign
   Purpose: Create a new campaign.

   - Accounts:

     - Campaign PDA (new account storing metadata like title, description, goal, deadline, raised_amount, creator).
     - Vault PDA (where contributions will be held).
     - Campaign creator (payer).
     - System Program.

   - Logic:
     - Derives campaign PDA from seeds.
     - Initializes state with goal, deadline, metadata.
     - Initializes a vault PDA for holding funds.

**Instructions Implemented:**

- Instruction 1: [Description of what it does]
- Instruction 2: [Description of what it does]
- ...

### Account Structure

[TODO: Describe your main account structures and their purposes]

```rust
// Example account structure (replace with your actual structs)
#[account]
pub struct YourAccountName {
    // Describe each field
}
```

## Testing

### Test Coverage

[TODO: Describe your testing approach and what scenarios you covered]

**Happy Path Tests:**

- Test 1: [Description]
- Test 2: [Description]
- ...

**Unhappy Path Tests:**

- Test 1: [Description of error scenario]
- Test 2: [Description of error scenario]
- ...

### Running Tests

```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

[TODO: Add any specific notes or context that would help evaluators understand your project better]
