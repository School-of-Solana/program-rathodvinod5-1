use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("The campaign deadline has already passed")]
    DeadlinePassed,
    #[msg("The campaign deadline has not yet passed")]
    DeadlineNotPassed,
    #[msg("Deadline should be greater than now!")]
    DeadlineShouldBeGreaterThanNow,
    #[msg("The funding goal was not met")]
    GoalNotMet,
    #[msg("The funding goal was already met")]
    GoalMet,
    #[msg("Funds already claimed")]
    AlreadyClaimed,
    #[msg("Already refunded")]
    AlreadyRefunded,
    #[msg("Contribution amount should be greater then 0")]
    InsufficientFunds,
    #[msg("Only owner can perform this operation")]
    UnauthorizedOwner,
    #[msg("Underflow")]
    Underflow,
    #[msg("Title too long")]
    TitleTooLong,
    #[msg("Description too long")]
    DescriptionTooLong,
}