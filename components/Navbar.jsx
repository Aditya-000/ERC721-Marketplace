// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function shortAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function Navbar({ account, onConnect, onLogout, isConnecting }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900/70 backdrop-blur border-b border-gray-800 fixed top-0 left-0 right-0 z-50 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className=" font-medium text-2xl text-purple-200 hover:text-purple-400">
            🛒 Marketplace
            </Link>

            {/* Page links (desktop) */}
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/mint" className="text-gray-300 hover:text-white text-xl">
                Mint
              </Link>
              <Link
                to="/my-nft"
                className="text-gray-300 hover:text-white text-xl"
              >
                My NFTs
              </Link>
              <Link
                to="/marketplace"
                className="text-gray-300 hover:text-white text-xl"
              >
                Marketplace
              </Link>
              <Link
                to="/sell"
                className="text-gray-300 hover:text-white text-xl"
              >
                Sell
              </Link>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            {!account ? (
              <button
                onClick={onConnect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-60"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-gray-800 text-gray-200 text-sm">
                  {shortAddress(account)}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="sm:hidden border-t border-gray-800 px-4 py-3 space-y-2">
          <Link
            to="/mint"
            className="block text-gray-300 hover:text-white text-sm"
            onClick={() => setOpen(false)}
          >
            Mint
          </Link>
          <Link
            to="/my-nft"
            className="block text-gray-300 hover:text-white text-sm"
            onClick={() => setOpen(false)}
          >
            My NFTs
          </Link>
          <Link
            to="/marketplace"
            className="block text-gray-300 hover:text-white text-sm"
            onClick={() => setOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/sell"
            className="block text-gray-300 hover:text-white text-sm"
            onClick={() => setOpen(false)}
          >
            Sell
          </Link>
          

          {!account ? (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="w-full px-4 py-2 mt-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="flex items-center justify-between mt-3">
              <span className="px-3 py-1 rounded-lg bg-gray-800 text-gray-200 text-sm">
                {shortAddress(account)}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
