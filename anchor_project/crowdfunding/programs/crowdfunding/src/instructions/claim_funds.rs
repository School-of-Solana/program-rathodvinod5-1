use anchor_lang::prelude::*;

use crate::states::Campaign;
use crate::errors::*;

pub fn claim_funds(ctx: Context<ClaimFunds>) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let creator = &mut ctx.accounts.creator;

    let date_now = Clock::get()?;
    require!(
        date_now.unix_timestamp > campaign.deadline,
        CustomError::DeadlineNotPassed
    );
    require!(
        campaign.total_donated >= campaign.goal_amount,
        CustomError::GoalNotMet
    );

    // let amount = campaign.to_account_info().lamports();
    // let amount = **campaign.to_account_info().lamports.borrow();
    // let instructions = transfer(&campaign.key(), &creator.key(), amount);

    // invoke(
    //     &instructions,
    //     &[
    //         campaign.to_account_info(),
    //         creator.to_account_info(),
    //         ctx.accounts.system_program.to_account_info(),
    //     ],
    // );

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