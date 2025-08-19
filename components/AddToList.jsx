import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function AddToList({ contract, wallet }) {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSell = async () => {
    if (!tokenId || !price) {
      toast.error(` Please enter both Token ID and Price.`);
      return;
    }

    if (!contract || !wallet) {
      toast.error(` Please connect your wallet.`);
      return;
    }

    try {
      setLoading(true);

      const priceInWei = ethers.parseEther(price.toString()); 

      const tx = await contract.listing(tokenId, priceInWei); 
      await tx.wait();

      toast.success(` NFT listed successfully! 🎉`);
      setTokenId("");
      setPrice("");
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast.error(` An error occurred while listing your NFT: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleUnlist = async () => {
    if (!tokenId) {
      toast.error(` Please enter the Token ID to unlist.`);
      return;
    }

    if (!contract || !wallet) {
      toast.error(` Please connect your wallet.`);
      return;
    }

    try {
      setIsLoading(true);

      const tx = await contract.cancelListing(tokenId); 
      await tx.wait();

      toast.success(` NFT unlisted successfully! 🎉`);
      setTokenId("");
    } catch (error) {
      console.error("Error unlisting NFT:", error);
      toast.error(` An error occurred while unlisting your NFT: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

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

        {/* Price Input */}
        <input
          type="number"
          step="0.001"
          placeholder="Enter Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Sell Button */}
        <button
          onClick={handleSell}
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition transform hover:scale-105"
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
          className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition transform hover:scale-105"
        >
          {isLoading ? "Unlisting..." : "Unlist"}
        </button>

      </div>
    </div>
  );
}
