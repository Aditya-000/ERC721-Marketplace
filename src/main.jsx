import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import Web3Providers from '../components/Web3Providers.jsx'
import "@rainbow-me/rainbowkit/styles.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Web3Providers>
      <App />
    </Web3Providers>
  </StrictMode>,
)
