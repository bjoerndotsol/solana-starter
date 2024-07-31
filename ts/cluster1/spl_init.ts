/**
 * This script initializes a new SPL token on the Solana blockchain.
 *
 * The script performs the following steps:
 * 1. Imports necessary modules and wallet information.
 * 2. Creates a connection to the Solana devnet.
 * 3. Uses the wallet's keypair to create a new mint (SPL token).
 * 4. Logs the mint address to the console.
 *
 * Usage:
 * 1. Ensure you have your wallet's secret key in the `ts/wba-wallet.json` file.
 * 2. Navigate to the project folder:
 *    ```bash
 *    cd ts/cluster1
 *    ```
 * 3. Run the script using yarn:
 *    ```bash
 *    yarn spl_init
 *    ```
 */

import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // Start here
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      6
    );

    console.log("mint", mint.toBase58());
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
