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

    // pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    //     msg!("Greetings from: {:?}", ctx.program_id);
    //     Ok(())
    // }

    pub fn init_campaign(
        ctx: Context<InitializeCampaign>, 
        goal: u64,
        deadline: i64,
        title: String,
        description: String,
    ) -> Result<()> {
        initialize_campaign(ctx, title, description, goal, deadline)
    }
}
