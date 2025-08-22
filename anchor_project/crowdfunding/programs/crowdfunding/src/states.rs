use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    creator: Pubkey,
    #[max_len(30)]
    title: String,
    #[max_len(50)]
    description: String,
    goal_amount: u64,
    total_donated: u64,
    deadline: i64,
    bump: u8,
    refunded: bool,
    claimed: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Contribution {
    campaign: Pubkey,
    contributor: Pubkey,
    total_amount_donated: u64,
}