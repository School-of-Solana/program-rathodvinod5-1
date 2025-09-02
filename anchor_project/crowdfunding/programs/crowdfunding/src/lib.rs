#![allow(unexpected_cfgs)]

pub mod instructions;
use instructions::*;
use anchor_lang::prelude::*;
pub mod states;
pub mod errors;

declare_id!("Ept1VxEScf1bzfkwfEous1ZCDj16QCirBBq9kXzYAgwG");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn init_campaign(
        ctx: Context<InitializeCampaign>, 
        title: String,
        description: String,
        goal: u64,
        deadline: i64,
    ) -> Result<()> {
        initialize_campaign(ctx, title, description, goal, deadline)
    }

    pub fn contribute_amount(
        ctx: Context<Contribute>, 
        amount: u64
    ) -> Result<()> {
        contribute(ctx, amount)
    }

    pub fn claim_fund_by_author(ctx: Context<ClaimFunds>) -> Result<()> {
        claim_funds(ctx)
    }

    pub fn refund_to_contributor(ctx: Context<Refund>) -> Result<()> {
        refund(ctx)
    }

    pub fn close_campaign(ctx: Context<DeleteCampaignDataAccount>) -> Result<()> {
        delete_campaign(ctx)
    }

    pub fn recontribute_amount(
        ctx: Context<ReContribute>, 
        amount: u64
    ) -> Result<()> {
        recontribute(ctx, amount)
    }
}
