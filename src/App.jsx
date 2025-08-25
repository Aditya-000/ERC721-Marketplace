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

function App() {


  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/my-nft" element={<MyNFT />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
