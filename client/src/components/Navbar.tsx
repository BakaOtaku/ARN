import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b border-white/10 bg-[#2A3335]/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo/Brand - Left side */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">
              Agent Resolver Protocol
            </Link>
          </div>

          {/* Spacer to push the following items to the right */}
          <div className="flex-grow" />

          {/* Navigation Links and Wallet - Right side */}
          <div className="flex items-center space-x-4">
            <div className="h-6 w-px bg-white/10" />
            <Link
              to="/info"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/info"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Stats
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <Link
              to="/create"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/create"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Create
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <Link
              to="/bets"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/bets"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Bets
            </Link>

            <div className="h-6 w-px bg-white/10" />

            {/* Wallet Connection */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
