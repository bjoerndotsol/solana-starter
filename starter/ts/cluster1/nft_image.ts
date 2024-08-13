/**
 * This script uploads an image to arweave for use in an NFT.
 *
 * The script performs the following steps:
 * 1. Imports necessary modules and wallet information.
 * 2. Creates a UMI instance connected to Solana devnet.
 * 3. Sets up the signer using the wallet's keypair.
 * 4. Loads an image file from the assets folder.
 * 5. Converts the image to a generic file format.
 * 6. Uploads the image.
 * 7. Logs the uploaded image URI to the console.
 *
 * Usage:
 * 1. Ensure you have your wallet's secret key in the `ts/wba-wallet.json` file.
 * 2. Place the image you want to upload in the `./assets/` folder.
 * 3. Navigate to the project folder:
 *    ```bash
 *    cd ts/cluster1
 *    ```
 * 4. Run the script using yarn:
 *    ```bash
 *    yarn nft_image
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
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image

    const image = await readFile("./assets/Generug.png");

    const generic = createGenericFile(image, "rug", {
      contentType: "image/png",
    });

    const [myUri] = await umi.uploader.upload([generic]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
