/**
 * This script mints a new NFT on the Solana blockchain.
 *
 * The script performs the following steps:
 * 1. Imports necessary modules and wallet information.
 * 2. Creates a UMI instance connected to Solana devnet.
 * 3. Sets up the signer using the wallet's keypair.
 * 4. Generates a new mint address for the NFT.
 * 5. Creates the NFT with specified metadata.
 * 6. Sends the transaction and confirms it.
 * 7. Logs the transaction signature and mint address to the console.
 *
 * Usage:
 * 1. Ensure you have your wallet's secret key in the `ts/wba-wallet.json` file.
 * 2. Make sure you have already uploaded the NFT metadata and have its URI.
 * 3. Navigate to the project folder:
 *    ```bash
 *    cd ts/cluster1
 *    ```
 * 4. Run the script using yarn:
 *    ```bash
 *    yarn nft_mint
 *    ```
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "This is a rug",
    symbol: "ST3T",
    uri: "https://arweave.net/JoIfz7BdlHRA07UyDdQTNBC_j74VpYrVVW3hj6F6WEI",
    sellerFeeBasisPoints: percentAmount(1),
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();
