use anchor_lang::prelude::*;
use anchor_lang::solana_program:: {
    program::invoke,
    system_instruction::transfer
};

use crate::states::*;
use crate::errors::*;

pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InsufficientFunds);

    let contribution_account = &mut ctx.accounts.contribution;
    let campaign_account = &mut ctx.accounts.campaign;
    let contributor = &mut ctx.accounts.contributor;

    let time_now = Clock::get()?;
    require!(
        time_now.unix_timestamp < campaign_account.deadline,
        CustomError::DeadlinePassed
    );

    let transfer_instruction = transfer(&contributor.key(), &campaign_account.key(), amount);

    invoke(
        &transfer_instruction,
        &[
            contributor.to_account_info(),
            campaign_account.to_account_info(),
        ],
    );

    contribution_account.contributor = ctx.accounts.contributor.key();
    contribution_account.campaign = campaign_account.key();
    contribution_account.total_amount_donated += amount;

    campaign_account.total_donated += amount;

    Ok(())
}


#[derive(Accounts)]
// #[instruction(title: String, creator: Pubkey)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,

    #[account(
        mut,
        // seeds = [b"campaign", creator.as_ref(), title.as_bytes()],
        // bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = contributor,
        space = 8 + Contribution::INIT_SPACE,
        seeds = [b"contributor", campaign.key().as_ref(), contributor.key().as_ref()],
        bump,
    )]
    pub contribution: Account<'info, Contribution>,

    pub system_program: Program<'info, System>,
}