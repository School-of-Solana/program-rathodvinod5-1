use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub creator: Pubkey,
    #[max_len(30)]
    pub title: String,
    #[max_len(50)]
    pub description: String,
    pub goal_amount: u64,
    pub total_donated: u64,
    pub deadline: i64,
    pub bump: u8,
    // pub refunded: bool,
    pub claimed: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Contribution {
    pub campaign: Pubkey,
    pub contributor: Pubkey,
    pub total_amount_donated: u64,
}