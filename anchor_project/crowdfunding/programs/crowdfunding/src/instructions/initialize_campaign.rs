use anchor_lang::prelude::*;

use crate::states::Campaign;
use crate::errors::CustomError;

 pub fn initialize_campaign(
    ctx: Context<InitializeCampaign>,
    title: String,
    description: String,
    goal_amount: u64,
    deadline: i64,
) -> Result<()> {
    msg!("initialize_campaign"); // Message will show up in the tx logs

    let clock = Clock::get()?;
    require!(
        deadline > clock.unix_timestamp,
        CustomError::DeadlineShouldBeGreaterThanNow
    );

     // Enforce length limits
    // require!(
    //     title.chars().count() <= 30,
    //     CustomError::TitleTooLong
    // );
    // require!(
    //     description.chars().count() <= 50,
    //     CustomError::DescriptionTooLong
    // );

    if title.chars().count() > 30 {
        return err!(CustomError::TitleTooLong); 
    }

    if description.chars().count() > 50 {
        return err!(CustomError::DescriptionTooLong);
    }

    let campaign = &mut ctx.accounts.campaign;
    campaign.creator = ctx.accounts.signer.key();
    campaign.title = title;
    campaign.description = description;
    campaign.goal_amount = goal_amount;
    campaign.deadline = deadline;
    campaign.bump = ctx.bumps.campaign;
    campaign.total_donated = 0;
    campaign.refunded = false;
    campaign.claimed = false;

    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct InitializeCampaign<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + Campaign::INIT_SPACE,
        // space = 395,
        seeds = [b"campaign", signer.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}