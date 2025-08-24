import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import Mint from '../pages/Mint';
import MyNFT from '../pages/MyNFT';
import MarketPlace from '../pages/MarketPlace';
import Sell from '../pages/Sell';
import HomePage from '../components/HomePage';
import { useWallet } from '../hooks/useWallet';

function App() {

  const { account, contract, isConnecting, connect, logout } = useWallet();

  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint" element={<Mint contract={contract} />} />
        <Route path="/my-nft" element={<MyNFT contract={contract} />} />
        <Route path="/marketplace" element={<MarketPlace contract={contract} />} />
        <Route path="/sell" element={<Sell contract={contract} />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
