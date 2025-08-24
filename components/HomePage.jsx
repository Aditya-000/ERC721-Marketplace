
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-[#18122B] via-[#393053] to-[#635985]">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-serif drop-shadow-lg leading-tight">
            Welcome to the <span className="text-[#A084DC]">ERC721 NFT</span> Marketplace
          </h1>
          <p className="text-base md:text-xl text-[#DED0B6] mb-10 font-light">
            Discover, mint, buy, and sell unique NFTs on a modern, decentralized platform.<br className="hidden md:block" /> Powered by Ethereum and built for creators and collectors.
          </p>
          <Link to="/marketplace" className="inline-block px-8 py-3 bg-[#A084DC] hover:bg-[#393053] text-white font-semibold rounded-lg shadow-lg transition text-lg">
            Explore Marketplace
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[#DED0B6] py-6 bg-[#18122B] bg-opacity-90 mt-auto text-sm">
        &copy; {new Date().getFullYear()} ERC721 Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
