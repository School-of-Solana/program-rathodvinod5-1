use anchor_lang::prelude::*;

use crate::states::Campaign;
use crate::errors::*;

pub fn claim_funds(ctx: Context<ClaimFunds>) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;

    let date_now = Clock::get()?;
    require!(
        date_now.unix_timestamp > campaign.deadline,
        CustomError::DeadlineNotPassed
    );
    require!(
        campaign.total_donated >= campaign.goal_amount,
        CustomError::GoalNotMet
    );

    require!(!campaign.claimed, CustomError::FundsAlreadyClaimed);

    let amount = **campaign.to_account_info().lamports.borrow();
    **campaign.to_account_info().lamports.borrow_mut() -= amount;
    **ctx.accounts.creator.lamports.borrow_mut() += amount;

    campaign.claimed = true;

    Ok(())
}


#[derive(Accounts)]
pub struct ClaimFunds<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut, has_one = creator @ CustomError::UnauthorizedOwner)]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}