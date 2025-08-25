import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import React from "react";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAccount, useWriteContract, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import { parseEther, formatEther } from "viem";
import ABI from "../ABI";
import contractAdd from "../contractAdd";

export default function Marketplace() {
  const [listedNFTs, setListedNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {address, isConnected } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  // Fetch Marketplace Listings
  useEffect(() => {
    const fetchListedNFTs = async () => {
      setIsLoading(true);

      try {
        // ⬇️ Call marketplace: returns [listings[], tokenIds[]]
        const [listings, tokenIds] = await readContract(config, {
          abi: ABI,
          address: contractAdd,
          functionName: "getAllListings",
        });

        const nftData = await Promise.all(
          listings.map(async (listing, index) => {
            const tokenId = tokenIds[index].toString();
            const price = formatEther(listing.price); // viem format
            const seller = listing.seller;

            // fetch tokenURI from NFT contract
            const tokenURI = await readContract(config, {
              abi: ABI,
              address: contractAdd,
              functionName: "tokenURI",
              args: [tokenId],
            });

            const metadataUrl = tokenURI.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            );

            const res = await fetch(metadataUrl);
            const metadata = await res.json();

            return {
              id: tokenId,
              ...metadata,
              price,
              seller,
            };
          })
        );

        setListedNFTs(nftData);
      } catch (err) {
        console.error(err);
        toast.error(`Error fetching NFTs: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListedNFTs();
  }, []);

  // ✅ Handle Buying NFT
  const handleBuy = async (nft) => {
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }

    if (nft.seller.toLowerCase() === address?.toLowerCase()) {
    toast.error("You cannot buy your own NFT.");
    return;
  }

    try {
      const txHash = await writeContractAsync({
        abi: ABI,
        address: contractAdd,
        functionName: "BuyNFT",
        args: [BigInt(nft.id)], // tokenId must be BigInt
        value: parseEther(nft.price.toString()), // ETH price in wei
      });

      toast.success(`NFT #${nft.id} bought for ${nft.price} ETH! 🎉 Tx: ${txHash}`);
    } catch (error) {
      console.error("Error buying NFT:", error);
      toast.error(`Failed to buy NFT #${nft.id}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-10 pt-16">
      <div>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          🛒 NFT Marketplace
        </h1>

        {isLoading ? (
          <Loader text="Fetching NFTs..." />
        ) : listedNFTs.length === 0 ? (
          <p className="text-center text-gray-400">No NFTs listed for sale.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listedNFTs.map((nft, index) => (
              <ListCard key={index} nft={nft} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
