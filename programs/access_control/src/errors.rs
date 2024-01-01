use anchor_lang::prelude::*;

#[error_code]
pub enum AccessControlError {
    #[msg("Not the admin.")]
    NotAdmin,
    #[msg("Not the operator.")]
    NotOperator,
    #[msg("Not product owner.")]
    NotProductOwner,
}
