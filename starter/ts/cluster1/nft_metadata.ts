/**
 * This script uploads NFT metadata to Arweave.
 *
 * The script performs the following steps:
 * 1. Imports necessary modules and wallet information.
 * 2. Creates a UMI instance connected to Solana devnet.
 * 3. Sets up the signer using the wallet's keypair.
 * 4. Prepares the NFT metadata following the Metaplex standard.
 * 5. Uploads the metadata to Arweave.
 * 6. Logs the uploaded metadata URI to the console.
 *
 * Usage:
 * 1. Ensure you have your wallet's secret key in the `ts/wba-wallet.json` file.
 * 2. Make sure you have already uploaded the NFT image and have its URI.
 * 3. Navigate to the project folder:
 *    ```bash
 *    cd ts/cluster1
 *    ```
 * 4. Run the script using yarn:
 *    ```bash
 *    yarn nft_metadata
 *    ```
 */

import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://arweave.net/GqAPIp9Ij3B6aLKcvUDm8dQJrMGbAF10_V09I0yhg5g";
    const metadata = {
      name: "This is a rug",
      symbol: "TIAR",
      description: "Do not use me, I am a rug.",
      image,
      attributes: [
        { trait_type: "rug level", value: "8/10" },
        { trait_type: "trust level", value: "0/10" },
        { trait_type: "pattern", value: "pixelated" },
        { trait_type: "border style", value: "purple" },
        { trait_type: "origin", value: "marrakesh" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
