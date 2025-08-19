import React from 'react';
import AddToList from '../components/AddToList';

export default function Sell({contract,wallet}) {
    if (!contract || !wallet) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-white text-lg">
                    Please connect your wallet to sell NFTs.
                </div>
            </div>
        );
    }
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center pt-14 justify-center">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
            <AddToList contract={contract} wallet={wallet} />
          </div>
        </div>
    );
}