use anchor_lang::prelude::*;

mod constants;
mod errors;
mod states;
use crate::{constants::*, errors::*, states::*};

declare_id!("5X3NaJMZ9py5VmGHvXgFCYb9Cr4hFQthjqveTKCqcTqJ");

#[program]
mod access_control {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.admin.signer = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn set_role(ctx: Context<SetRole>, _operator: Pubkey) -> Result<()> {
        ctx.accounts.operator.signer = _operator;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = signer, 
        space = 8 + 32, 
        seeds = [ADMIN_SEED, signer.key().as_ref()], 
        bump
    )]
    pub admin: Account<'info, AccessControl>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_operator: Pubkey)]
pub struct SetRole<'info> {
    #[account(
        mut, 
        seeds = [ADMIN_SEED, signer.key().as_ref()], 
        bump, 
        has_one = signer,
    )]
    pub admin: Account<'info, AccessControl>,

    #[account(
        init, 
        payer = signer,
        space = 8 + 32, 
        seeds = [OPERATOR_SEED, _operator.key().as_ref()], 
        bump
    )]
    pub operator: Account<'info, AccessControl>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
