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
