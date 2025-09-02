use anchor_lang::prelude::*;
use anchor_lang::solana_program:: {
    system_instruction::transfer,
    program::invoke,
};
use crate:: {
    states::*,
    errors::*,
};

pub fn recontribute(ctx: Context<ReContribute>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InsufficientFunds);

    let contribution_account = &mut ctx.accounts.contribution;
    let campaign_account = &mut ctx.accounts.campaign;
    let contributor = &mut ctx.accounts.contributor;

    let time_now = Clock::get()?;
    require!(
        time_now.unix_timestamp < campaign_account.deadline,
        CustomError::DeadlinePassed
    );

    let transfer_instruction = transfer(
        &contributor.key(), 
        &campaign_account.key(), 
        amount
    );

    let _ = invoke(
        &transfer_instruction,
        &[
            contributor.to_account_info(),
            campaign_account.to_account_info(),
        ],
    );

    contribution_account.total_amount_donated += amount;

    campaign_account.total_donated += amount;

    Ok(())
}

#[derive(Accounts)]
pub struct ReContribute<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,

    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        has_one = campaign,
        has_one = contributor @ CustomError::UnauthorizedOwner,
    )]
    pub contribution: Account<'info, Contribution>,

    pub system_program: Program<'info, System>,
}