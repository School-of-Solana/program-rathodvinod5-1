#![allow(unexpected_cfgs)]

use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod instructions;
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
}
