import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("53zKtgMeoyLBSFqXZkBdG3oPzMdfnWfPZavP2D7gdQKn");

// Recipient address
const to = new PublicKey("5XCdQVqopjAoVkNhkXWHmeHNhRS5bPiATUULy8FHDySX");

const token_decimals = 1_000_000n;

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const tx = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      10n * token_decimals
    );

    console.log(
      `Transferred 10 token from ${fromTokenAccount.address.toBase58()} to ${toTokenAccount.address.toBase58()}`
    );
    console.log(
      `Transaction signature: https://explorer.solana.com/transaction/${tx}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
