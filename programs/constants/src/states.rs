use anchor_lang::prelude::*;

#[account]
pub struct AccessControl {
    pub signer: Pubkey,
}
