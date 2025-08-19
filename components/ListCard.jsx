import React from "react";

export default function ListCard({ nft, onBuy }) {
  return (
    <div className="max-w-xs bg-gray-900 rounded-xl border border-white/10 shadow-md shadow-white/20 hover:shadow-white/40 transition-all duration-300 overflow-hidden">
      {/* NFT Image */}
      <div className="w-full h-36 bg-gray-800">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* NFT Info */}
      <div className="p-3 space-y-2">
      <h2 className="text-base text-white ">
          Id: {nft.id}
        </h2>
        <h2 className="text-base font-semibold text-white truncate">
          {nft.name}
        </h2>
        <p className="text-xs text-gray-400 line-clamp-2">{nft.description}</p>

        <div className="flex justify-between items-center pt-1">
          <span className="text-purple-400 font-bold text-sm">
            {nft.price} ETH
          </span>
          <button
            onClick={() => onBuy(nft)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow hover:shadow-purple-500/40 transition"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
