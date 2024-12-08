import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";
import { http } from "viem";

export const config = getDefaultConfig({
  appName: "Betting System",
  projectId: "YOUR_PROJECT_ID",
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
});
