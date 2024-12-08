import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { holesky } from "wagmi/chains";
import { http } from "viem";

export const config = getDefaultConfig({
  appName: "Betting System",
  projectId: "YOUR_PROJECT_ID",
  chains: [holesky],
  transports: {
    [holesky.id]: http(),
  },
});
