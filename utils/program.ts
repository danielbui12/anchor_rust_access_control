import { Connection, PublicKey } from "@solana/web3.js";
import { ADMIN_SEED, OPERATOR_SEED, PROGRAM_ADDRESS } from "./const";

export const getAdminPDA = (
  admin: PublicKey,
  programAddress: PublicKey = PROGRAM_ADDRESS
): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [ADMIN_SEED, admin.toBuffer()],
    programAddress,
  )[0];
};

export const getOperatorPDA = (
  operator: PublicKey,
  programAddress: PublicKey = PROGRAM_ADDRESS
): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [OPERATOR_SEED, operator.toBuffer()],
    programAddress,
  )[0];
};

export const confirmTx = async (connection: Connection, txHash: string) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });
  console.info('Tx', txHash, 'has confirmed', blockhashInfo);
};