import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { parseEther } from "viem";
import { readContract } from "wagmi/actions";
import ABI from "../ABI";
import contractAdd from "../contractAdd";

export default function AddToList() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  // Check ownership
  const checkOwnership = async (tokenId) => {
    try {
      const ownedTokens = await readContract(config, {
        abi: ABI,
        address: contractAdd,
        functionName: "getMyAllNFT",
        account: address,
      });

      const ownedIds = ownedTokens.map((id) => id.toString());
      return ownedIds.includes(tokenId.toString());
    } catch (err) {
      console.error("Ownership check failed:", err);
      return false;
    }
  };

  // Check if token is listed (seller != zero address)
const checkListedStatus = async (tokenId) => {
  try {
    const listing = await readContract(config, {
      abi: ABI,
      address: contractAdd,
      functionName: "listings",
      args: [BigInt(tokenId)],
    });
    console.log("listing raw:", listing);

    if (!listing) return false;
    // Structs can be arrays or objects: Extract accordingly
    const seller = listing.seller ?? listing[0];
    const priceRaw = listing.price ?? listing[1];
    const price = priceRaw ? BigInt(priceRaw) : 0n;

    console.log("seller extracted:", seller);
    console.log("price extracted:", price);

    return !(seller?.toLowerCase() === "0x0000000000000000000000000000000000000000" || price === 0n);
  } catch (err) {
    console.error("Error checking listed status:", err);
    return false;
  }
};


const handleSell = async () => {
  if (!tokenId || !price) {
    toast.error("Please enter both Token ID and Price.");
    return;
  }
  if (!isConnected) {
    toast.error("Please connect your wallet.");
    return;
  }

  const ownsNFT = await checkOwnership(tokenId);
  if (!ownsNFT) {
    toast.error("You don't own this NFT. Cannot list.");
    return;
  }

  const isListed = await checkListedStatus(tokenId);
  if (isListed) {
    toast.error(`Token ID ${tokenId} is already listed.`);
    return;
  }

  try {
    setLoading(true);
    const priceInWei = parseEther(price.toString());

    const txHash = await writeContractAsync({
      abi: ABI,
      address: contractAdd,
      functionName: "listing",
      args: [BigInt(tokenId), priceInWei],
    });

    toast.success(`NFT listed successfully! 🎉 Tx: ${txHash}`);
    setTokenId("");
    setPrice("");
  } catch (error) {
    console.error("Error listing NFT:", error);
    toast.error(`Error while listing NFT: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  const handleUnlist = async () => {
    if (!tokenId) {
      toast.error("Please enter the Token ID to unlist.");
      return;
    }
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }
    const ownsNFT = await checkOwnership(tokenId);
    if (!ownsNFT) {
      toast.error("You don't own this NFT. Cannot unlist.");
      return;
    }

    const isListed = await checkListedStatus(tokenId);
    if (!isListed) {
      toast.error(`Token ID ${tokenId} is not currently listed.`);
      return;
    }

    try {
      setIsLoading(true);

      const txHash = await writeContractAsync({
        abi: ABI,
        address: contractAdd,
        functionName: "cancelListing",
        args: [BigInt(tokenId)],
      });

      toast.success(`NFT unlisted successfully! 🎉 Tx: ${txHash}`);
      setTokenId("");
    } catch (error) {
      console.error("Error unlisting NFT:", error);
      toast.error(`Error while unlisting NFT: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-3 max-w-md mx-auto mb-10 ">
      <h2 className="text-xl font-bold text-white mb-4 text-center">📤 List Your NFT</h2>

      <div className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="number"
          step="0.001"
          placeholder="Enter Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleSell}
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition transform hover:scale-105 cursor-pointer"
        >
          {loading ? "Listing..." : "SELL"}
        </button>
      </div>

      <hr className="my-4 border-0 h-px bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

      <div className="bg-gray-900 rounded-2xl shadow-lg p-6 max-w-md mx-auto mb-10">
        <h2 className="text-xl font-bold text-white mb-4 text-center">↩️ Unlist your NFT</h2>
        <input
          type="number"
          placeholder="Enter Token ID to Unlist"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleUnlist}
          disabled={isLoading}
          className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition transform hover:scale-105 cursor-pointer"
        >
          {isLoading ? "Unlisting..." : "Unlist"}
        </button>
      </div>
    </div>
  );
}
