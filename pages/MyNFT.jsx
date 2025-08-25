import { useEffect, useState } from "react";
import React from "react";
import NFTCard from "../components/NFTCard";
import Loader from "../components/Loader";
import { useAccount, useConfig} from "wagmi";
import { readContract } from "wagmi/actions";
import ABI from "../ABI";
import contractAdd from "../contractAdd";

export default function MyNFTs() {
  const [myNfts, setMyNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const config = useConfig();

  // 🔹 Fetch NFTs owned by the connected wallet
  useEffect(() => {
    let isMounted = true;

    const fetchMyNFTs = async () => {
      if (!address) return;
      setIsLoading(true);

      try {
        // 1. Read all NFTs owned by user
        const nfts = await readContract(config, {
          abi: ABI,
          address: contractAdd,
          functionName: "getMyAllNFT",
          account: address,
        });

        // 2. Fetch metadata and listing status for each token
        const nftData = await Promise.all(
          nfts.map(async (nft) => {
            const tokenId = nft.toString();

            // Fetch tokenURI
            const tokenURI = await readContract(config, {
              abi: ABI,
              address: contractAdd,
              functionName: "tokenURI",
              args: [tokenId],
            });

            if (
              !tokenURI.startsWith("ipfs://") &&
              !tokenURI.startsWith("https://")
            ) {
              return null;
            }

            // Fetch metadata
            const res = await fetch(
              tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            );
            const metadata = await res.json();

            // Fetch listing status
            let isListed = false;
            try {
              const listing = await readContract(config, {
                abi: ABI,
                address: contractAdd,
                functionName: "listings",
                args: [tokenId],
              });
            const price = listing?.price ?? listing?.[1];

            if (price && BigInt(price) > 0n) {
              isListed = true;
            }
            } catch (e) {
              // ignore error, treat as not listed
            }

            return {
              id: tokenId,
              ...metadata,
              isListed,
            };
          })
        );

        if (isMounted) {
          setMyNfts(nftData.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMyNFTs();

    return () => {
      isMounted = false;
    };
  }, [address]);

  if (!address) {
    return (
      <div className="pt-14 min-h-screen bg-gradient-to-br text-center items-center justify-center flex from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-8">
        <div className="text-center text-lg">
          Please connect your wallet to view your NFTs.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-8">
      {isLoading ? (
        <Loader text="Fetching NFTs..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 pt-14">
          {myNfts.length > 0 ? (
            myNfts.map((nft, index) => <NFTCard key={index} nft={nft} />)
          ) : (
            <p className="text-gray-500">No NFTs found</p>
          )}
        </div>
      )}
    </div>
  );
}
