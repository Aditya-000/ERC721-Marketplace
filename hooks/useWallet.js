// src/hooks/useWallet.js
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import contractAdd from "../contractAdd";
import ABI from "../ABI";



export function useWallet() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const initWithAccounts = useCallback(async (accounts) => {
    if (!accounts || accounts.length === 0) return;
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    const addr = ethers.getAddress(accounts[0]);
    const c = new ethers.Contract(contractAdd, ABI, signer);
    setProvider(browserProvider);
    setAccount(addr);
    setContract(c);
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }
    setIsConnecting(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      localStorage.setItem("isWalletConnected", "true");
      await initWithAccounts(accounts);
    } finally {
      setIsConnecting(false);
    }
  }, [initWithAccounts]);

  const logout = useCallback(() => {
    localStorage.removeItem("isWalletConnected");
    setAccount(null);
    setContract(null);
    setProvider(null);
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!window.ethereum) return;
      const shouldRestore = localStorage.getItem("isWalletConnected") === "true";
      if (!shouldRestore) return;

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_accounts", []); // silent
      if (accounts.length > 0) {
        await initWithAccounts(accounts);
      } else {
        localStorage.removeItem("isWalletConnected");
      }
    };
    restore();


    const onAccountsChanged = async (accs) => {
      if (accs.length === 0) {
        logout();
      } else {
        await initWithAccounts(accs);
      }
    };

    const onChainChanged = async () => {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_accounts", []);
      if (accounts.length > 0) {
        await initWithAccounts(accounts);
      }
    };

    window.ethereum?.on("accountsChanged", onAccountsChanged);
    window.ethereum?.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener("chainChanged", onChainChanged);
    };
  }, [initWithAccounts, logout]);

  return { account, contract, provider, isConnecting, connect, logout };
}
