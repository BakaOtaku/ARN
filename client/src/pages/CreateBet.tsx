import React, { useState } from "react";
import { Youtube } from "lucide-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ExternalLink } from "lucide-react";
import contractABI from "./av.json";
import { Hex } from "viem";

// Contract address
const CONTRACT_ADDRESS = "0x4f698fcdaf7bbfa2d833756107530d44230f41c5";
const EXPLORER_URL = "https://holesky.etherscan.io/tx/";

export function CreateBet() {
  const [videoUrl, setVideoUrl] = useState("");
  const [question, setQuestion] = useState("");

  // Setup contract write hook
  const { data: hash, error, writeContract } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set deadline to 7 days from now (in seconds)
    const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    try {
      writeContract({
        address: CONTRACT_ADDRESS as Hex,
        abi: contractABI,
        functionName: "createNewTask",
        args: [videoUrl, question, BigInt(deadline)],
      });
    } catch (error) {
      console.error("Error creating bet:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">New Bet</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="mb-6">
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              YouTube Video URL
            </label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Bet Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What would you like to bet on?"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isConfirming}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition-colors disabled:bg-purple-400"
          >
            {isConfirming ? "Creating..." : "Create Bet"}
          </button>

          {isConfirmed && hash && (
            <div className="text-green-500 text-center mt-2 flex items-center justify-center gap-2">
              <span>Bet created successfully!</span>
              <a
                href={`${EXPLORER_URL}${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View on Explorer
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center mt-2">
              Error: {error.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
