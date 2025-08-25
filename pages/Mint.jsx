import React, { useState } from "react";
import { uploadFileToPinata, uploadJSONToPinata } from "../utils/connectPinata";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";
import ABI from "../ABI";
import contractAdd from "../contractAdd";

export default function Mint() {
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImage, setNftImage] = useState(null);
  const [active, setActive] = useState(false);

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleMint = async (e) => {
    e.preventDefault();

    if (!nftName || !nftDescription || !nftImage) {
      toast.error("Please fill in all fields before minting.");
      return;
    }

    if (!isConnected) {
      toast.error("Wallet not connected.");
      return;
    }

    try {
      setActive(true);

      // 1. Upload image to Pinata
      const imageUrl = await uploadFileToPinata(nftImage);

      // 2. Create metadata
      const metadata = {
        name: nftName,
        description: nftDescription,
        image: imageUrl,
      };

      // 3. Upload metadata JSON to Pinata
      const metadataUrl = await uploadJSONToPinata(JSON.stringify(metadata));

      // 4. Call contract `safeMint(metadataUrl)`
      const txHash = await writeContractAsync({
        address: contractAdd,
        abi: ABI,
        functionName: "safeMint",
        args: [metadataUrl],
      });

      toast.success(`NFT minted successfully! 🎉 Tx: ${txHash}`);
      setNftName("");
      setNftDescription("");
      setNftImage(null);
    } catch (err) {
      console.error("Error minting NFT:", err);
      toast.error("Error minting NFT. Please try again.");
    } finally {
      setActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-14 from-gray-950 via-gray-900 to-black text-gray-100 flex justify-center items-center px-4">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-xl font-semibold mb-6 text-center tracking-wide">
          Mint Your NFT
        </h1>

        <form className="flex flex-col gap-3 text-sm" onSubmit={handleMint}>
          <input
            type="text"
            placeholder="NFT Name"
            className="px-4 py-2 rounded-lg bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
          />
          <textarea
            placeholder="NFT Description"
            className="px-4 py-2 rounded-lg bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            rows="3"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
          />
          <input
            type="file"
            className="px-4 py-2 rounded-lg bg-gray-800/70 text-gray-400 file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            accept="image/*"
            onChange={(e) => setNftImage(e.target.files[0])}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 hover:from-green-400 hover:to-green-700 px-4 py-2 rounded-lg transition font-medium cursor-pointer"
            disabled={active}
          >
            {active ? "Minting..." : "Mint NFT"}
          </button>
        </form>
      </div>
    </div>
  );
}
