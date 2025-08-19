import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from '../components/Navbar';
import { Toaster } from "react-hot-toast";
import Mint from '../pages/Mint';
import MyNFT from '../pages/MyNFT';
import MarketPlace from '../pages/MarketPlace';
import Sell from '../pages/Sell';
import { useWallet } from '../hooks/useWallet';


function App() {
  const { account, contract, isConnecting, connect, logout } = useWallet();

  // Function to connect to the wallet
 

  return (
    <Router>
       <div>
             <Navbar
               account={account}
               onConnect={connect}
               onLogout={logout}
               isConnecting={isConnecting}
              /> 
       </div>
      

      <Routes>
        <Route path="/" element={<MarketPlace />} />
        <Route path="/mint" element={<Mint contract={contract} wallet={account} />} />
        <Route path="/my-nft" element={<MyNFT contract={contract} wallet={account} />} />
        <Route path="/marketplace" element={<MarketPlace contract={contract} wallet={account}/>} />
        <Route path="/sell" element={<Sell  contract={contract} wallet={account}/>} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />

    </Router>
  )
}

export default App
