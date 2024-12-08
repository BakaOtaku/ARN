import { useEffect, useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import { encodeFunctionData, decodeAbiParameters, Hex } from "viem";
import contractABI from "./av.json";
import betABI from "./bet.json";
import { useWriteContract } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";

interface Bet {
  id: number;
  videoUrl: string;
  question: string;
  deadline: number;
  totalLocked: number;
  isResolved: boolean;
  resolutionResult?: boolean;
}

const CONTRACT_ADDRESS = "0xc2a8d9e98bc627fc7aa0152a4ce0a14e4d302e18";
const BET_ADDRESS = "0x22e8439DEC2D073CC6E79A70f1D72f48701fEdF3";
const RESOLVER_ADDRESS = "0xA39a7105968d6F193c42Ac1995db54BAE6CE4024";
const EXPLORER_URL = "https://amoy.polygonscan.com/tx/";

export function ActiveBets() {
  const [bets, setBets] = useState<Bet[]>([]);
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const fetchedBets: Bet[] = [];
        const currentTime = Math.floor(Date.now() / 1000);

        for (let i = 1; i <= 10; i++) {
          try {
            const taskData = encodeFunctionData({
              abi: contractABI,
              functionName: "allTasks",
              args: [i],
            });

            const taskResult = await window.ethereum.request({
              method: "eth_call",
              params: [
                {
                  to: CONTRACT_ADDRESS,
                  data: taskData,
                },
                "latest",
              ],
            });

            // Decode the response
            const decodedTask = decodeAbiParameters(
              [
                { name: "video_url", type: "string" },
                { name: "task_content", type: "string" },
                { name: "deadline", type: "uint256" },
                { name: "taskCreatedBlock", type: "uint32" },
              ],
              taskResult
            );

            // Fetch resolved status
            const resolvedData = encodeFunctionData({
              abi: contractABI,
              functionName: "resolvedTaskResponses",
              args: [RESOLVER_ADDRESS, i],
            });

            const resolvedResult = await window.ethereum.request({
              method: "eth_call",
              params: [
                {
                  to: CONTRACT_ADDRESS,
                  data: resolvedData,
                },
                "latest",
              ],
            });

            const isResolved =
              resolvedResult !==
              "0x0000000000000000000000000000000000000000000000000000000000000000";

            // Decode the resolution result if resolved
            const resolutionResult = isResolved
              ? resolvedResult ===
                "0x0000000000000000000000000000000000000000000000000000000000000001"
              : undefined;

            if (decodedTask && Number(decodedTask[2]) > currentTime) {
              fetchedBets.push({
                id: i,
                videoUrl: decodedTask[0],
                question: decodedTask[1],
                deadline: Number(decodedTask[2]),
                totalLocked: 0,
                isResolved,
                resolutionResult,
              });
            }
          } catch (error) {
            console.error("Error fetching bet:", error);
            break;
          }
        }

        setBets(fetchedBets);
      } catch (error) {
        console.error("Error fetching bets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBets();
  }, []);

  console.log(bets);

  const handleBet = async (betId: number, choice: "yes" | "no") => {
    try {
      console.log("Placing bet...", betId, choice);
      setIsSubmitting(true);
      await writeContract({
        address: BET_ADDRESS as Hex,
        abi: betABI,
        functionName: "makeBet",
        args: [BigInt(betId)],
        value: BigInt(50000000000000000), // 0.05 ETH in wei
      });
    } catch (error) {
      console.error("Error placing bet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Active Bets</h1>
      {bets.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No active bets found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-purple-500 transition-colors"
            >
              <div className="relative aspect-video mb-4">
                <img
                  src={`https://img.youtube.com/vi/${
                    bet.videoUrl.split("v=")[1]
                  }/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  className="rounded-md object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-80" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Bet #{bet.id}
              </h3>
              <p className="text-gray-300 mb-4">{bet.question}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-400">
                  {bet.totalLocked} ETH Locked
                </span>
                <div className="text-sm">
                  {bet.isResolved ? (
                    <span
                      className={`font-medium ${
                        bet.resolutionResult ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      Resolved: {bet.resolutionResult ? "Yes" : "No"}
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Ends in{" "}
                      {Math.floor((bet.deadline - Date.now() / 1000) / 3600)}h
                    </span>
                  )}
                </div>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={bet.isResolved}
                  onClick={() => {
                    setSelectedBet(bet);
                    setIsModalOpen(true);
                  }}
                >
                  {bet.isResolved ? "Resolved" : "Place Bet"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedBet && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">
              Place Your Bet
            </h2>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">{selectedBet.question}</p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Current total locked: {selectedBet.totalLocked} ETH</p>
                <p>
                  Ends in:{" "}
                  {Math.floor(
                    (selectedBet.deadline - Date.now() / 1000) / 3600
                  )}
                  h
                </p>
              </div>
            </div>

            {!isConfirmed ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-green-600/20 rounded-lg bg-green-600/10">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      Yes
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Bet that this will happen
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Fixed bet amount: 0.05 ETH (~$200)
                    </p>
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
                      onClick={() => handleBet(selectedBet.id, "yes")}
                      disabled={isSubmitting || isConfirming}
                    >
                      {isSubmitting || isConfirming ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          {isConfirming ? "Confirming..." : "Processing..."}
                        </div>
                      ) : (
                        "Bet Yes"
                      )}
                    </button>
                  </div>

                  <div className="p-4 border border-red-600/20 rounded-lg bg-red-600/10">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      No
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Bet that this won't happen
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Fixed bet amount: 0.05 ETH (~$200)
                    </p>
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md transition-colors disabled:bg-red-800 disabled:cursor-not-allowed"
                      onClick={() => handleBet(selectedBet.id, "no")}
                      disabled={isSubmitting || isConfirming}
                    >
                      {isSubmitting || isConfirming ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          {isConfirming ? "Confirming..." : "Processing..."}
                        </div>
                      ) : (
                        "Bet No"
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Bet Placed Successfully!
                  </h3>
                  {hash && (
                    <a
                      href={`${EXPLORER_URL}${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors mt-2"
                    >
                      View on Explorer
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
