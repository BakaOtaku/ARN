import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, PlusCircle } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-white">BetSmart</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-800'
                }`}
              >
                Active Bets
              </Link>
              <Link
                to="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/create'
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-800'
                }`}
              >
                Create Bet
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}