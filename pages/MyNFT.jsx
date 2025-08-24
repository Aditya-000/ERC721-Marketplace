import { useEffect, useState } from 'react';
import React from 'react';
import NFTCard from '../components/NFTCard';
import Loader from '../components/Loader';
import { useAccount } from 'wagmi';



export default function MyNFTs({ contract}) {
  const [myNfts, setMyNfts] = useState([]);
  const [isloading , setIsLoading] = useState(false);

  const account = useAccount();

  useEffect(() => {
    let isMounted = true;
    const fetchMyNFTs = async () => {
      if (!account.address || !contract) return;
      setIsLoading(true);
      try {
        const nfts = await contract.getMyAllNFT();
        const nftData = await Promise.all(
          nfts.map(async (nft) => {
            const token = nft.toString();
            const tokenURI = await contract.tokenURI(token);

            if (!tokenURI.startsWith("ipfs://") && !tokenURI.startsWith("https://")) {
              return null;
            }

            let metadataurl = tokenURI;

            const res = await fetch(metadataurl);
            const metadata = await res.json();


            return {
              id: token,
              ...metadata,
            };
          })
        )


        if (isMounted) {
          setMyNfts(nftData.filter(Boolean));
        }

      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchMyNFTs();
    setIsLoading(false);
    return () => { isMounted = false };
  }, [account.address,contract]);

  if (!account.address) {
    return (
      <div className="pt-14 min-h-screen bg-gradient-to-br text-center items-center justify-center flex from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-8">
        <div className="text-center text-lg">
           Please connect your wallet to view your NFTs.
        </div>
      </div>
    );
  }

  if (!contract) {
      return (
      <div className="pt-14 min-h-screen bg-gradient-to-br text-center items-center justify-center flex from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-8">
        <div className="text-center text-lg">
          NFT Contract instant is NULL
        </div>
      </div>
    );
  }


  return (
    <div className=" pt-14 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-8">
      {isloading ? (
       <Loader text="Fetching NFTs..."/>
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






