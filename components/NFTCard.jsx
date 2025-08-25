import React from 'react';

export default function NFTCard({ nft }) {
  return (
    <div className="w-full bg-gray-900 rounded-lg border border-white/10 shadow-md shadow-white/20 hover:shadow-white/40 transition-all duration-300 overflow-hidden relative">
      {/* Listed badge */}
      {nft.isListed ? (
        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
          Listed
        </span>
      ) : (
        <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10 opacity-80">
          Not Listed
        </span>
      )}

      {/* NFT Image */}
      <div className="w-full h-40 bg-gray-800 flex items-center justify-center border-gray-800">
        <img
          src={nft.image}
          alt={nft.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* NFT Info */}
      <div className="p-3 flex flex-col gap-1">
        <h1 className="text-sm text-gray-400 font-medium">Token ID: {nft.id}</h1>
        <h2 className="text-base font-semibold text-white truncate">
          {nft.name}
        </h2>
        <p className="text-xs text-gray-400 line-clamp-2">{nft.description}</p>
      </div>
    </div>
  );
}
