import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import type { AccessControl } from "../target/types/access_control";
import { confirmTx, getAdminPDA, getOperatorPDA } from "../utils/program";

describe("AccessControl", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AccessControl as anchor.Program<AccessControl>;
  const adminPDA = getAdminPDA(program.provider.publicKey, program.programId);

  it("initialize", async () => {
    // Send transaction
    const txHash = await program.methods
      .initialize()
      .accounts({
        admin: adminPDA,
        signer: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await confirmTx(program.provider.connection, txHash);

    // Fetch the created account
    const account = await program.account.accessControl.fetch(adminPDA);

    console.log("On-chain data is:", account);

    // Check whether the data on-chain is equal to local 'data'
    assert(account.signer.toString() === program.provider.publicKey.toString());
  });

  it("add operator", async function() {
    // Generate keypair for the new account
    const newAccountKp = new web3.Keypair();
    // Send transaction
    const txHash = await program.methods
      .setRole(newAccountKp.publicKey)
      .accounts({
        admin: adminPDA,
        operator: getOperatorPDA(newAccountKp.publicKey, program.programId),
        signer: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await confirmTx(program.provider.connection, txHash);

    // Fetch the created account
    const newAccounts = await program.account.accessControl.all();

    console.log("On-chain data is:", newAccounts);

    // Check whether the data on-chain is equal to local 'data'
    assert(newAccounts.length > 1);
  })


  it("should fail", async function () {
    try {
      // Generate keypair for the new account
      const newAccountKp = new web3.Keypair();
      // Send transaction
      const txHash = await program.methods
        .setRole(newAccountKp.publicKey)
        .accounts({
          admin: getAdminPDA(newAccountKp.publicKey, program.programId),
          operator: getOperatorPDA(newAccountKp.publicKey, program.programId),
          signer: program.provider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  
      // Confirm transaction
      await confirmTx(program.provider.connection, txHash);
      assert(false);
    } catch (error) {
      console.log(error);
      assert(true);
    }
  })
});
