import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import React from "react";
import { ethers } from "ethers";
import Loader from "../components/Loader";
import toast from "react-hot-toast";



export default function Marketplace({ contract }) {
  const [listedNFTs, setListedNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchListedNFTs = async () => {
      if (!contract) return;
      setIsLoading(true); 
    
      try {
        // destructure dono arrays
        const [listings, tokenIds] = await contract.getAllListings();
    
        const nftData = await Promise.all(
          listings.map(async (listing, index) => {
            const tokenId = tokenIds[index].toString(); // tokenId array se
            const price = ethers.formatEther(listing.price);     // struct ke andar price
            const seller = listing.seller;   
            
            // struct ke andar seller
    
            // tokenURI fetch
            const tokenURI = await contract.tokenURI(tokenId);
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
        toast.error(`Error fetching NFTs: ${err.message}`);
      }}
    
    fetchListedNFTs();
    setIsLoading(false);
  },[contract]);



  const handleBuy = async (nft) => {
    if (!contract) {
      toast.error(`Please connect your wallet`)
      return;
    }

    try {
      const tx = await contract.BuyNFT(nft.id, { value: nft.priceEth });
      await tx.wait();
      toast.success(`NFT #${nft.id} bought for ${nft.price} ETH! 🎉`);
    } catch (error) {
      console.error("Error buying NFT:", error);
      toast.error(`Failed to buy NFT #${nft.id}. Please try again.`);
    }
  }


  

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
            <ListCard key={index} nft={nft} onBuy={handleBuy}/>
            ))}
          </div>
           )}
      </div>
    </div>
  );
}

