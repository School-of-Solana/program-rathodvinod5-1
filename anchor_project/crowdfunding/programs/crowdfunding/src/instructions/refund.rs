use anchor_lang::prelude::*;

use crate:: {
    states::*,
    errors::*,
};

pub fn refund(ctx: Context<Refund>) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let contribution = &mut ctx.accounts.contribution;

    let date_now = Clock::get()?;
    require!(
        date_now.unix_timestamp > campaign.deadline,
        CustomError::DeadlineNotPassed
    );
    require!(
        campaign.total_donated < campaign.goal_amount,
        CustomError::GoalMet
    );
    require!(
        contribution.total_amount_donated > 0,
        CustomError::AlreadyRefunded
    );

    let amount = contribution.total_amount_donated;
    contribution.total_amount_donated = 0;

    **campaign.to_account_info().lamports.borrow_mut() -= amount;
    **ctx.accounts.contributor.lamports.borrow_mut() += amount;
    campaign.total_donated = campaign
        .total_donated
        .checked_sub(amount)
        .ok_or(ErrorCode::Underflow)?;

    Ok(())
}


#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,

    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        has_one = contributor @ CustomError::UnauthorizedOwner,
        seeds = [b"contributor", campaign.key().as_ref(), contributor.key().as_ref()],
        bump,
    )]
    pub contribution: Account<'info, Contribution>,
}