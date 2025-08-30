use anchor_lang::prelude::*;
use crate:: {
    states::*,
    errors::*,
};

pub fn delete_campaign_account(
    ctx: Context<DeleteCampaignDataAccount>,
    title: String,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteCampaignDataAccount<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        has_one = creator @ CustomError::UnauthorizedOwner,
        close = creator,
        seeds = [b"campaign", creator.key().as_ref(), title.as_bytes()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}