/**
 * This script mints new SPL tokens and sends them to an associated token account (ATA) on the Solana blockchain.
 *
 * The script performs the following steps:
 * 1. Imports necessary modules and wallet information.
 * 2. Creates a connection to the Solana devnet.
 * 3. Uses the wallet's keypair to get or create an ATA.
 * 4. Mints new tokens to the ATA.
 * 5. Logs the ATA address and mint transaction ID to the console.
 *
 * Usage:
 * 1. Ensure you have your wallet's secret key in the `ts/wba-wallet.json` file.
 * 2. Navigate to the project folder:
 *    ```bash
 *    cd ts/cluster1
 *    ```
 * 3. Run the script using yarn:
 *    ```bash
 *    yarn spl_mint
 *    ```
 */

import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("53zKtgMeoyLBSFqXZkBdG3oPzMdfnWfPZavP2D7gdQKn");

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    console.log(`Your ata is: ${ata.address.toBase58()}`);

    // Mint to ATA
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      token_decimals * 1_000_000n
    );

    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
