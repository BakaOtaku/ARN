import { CloudLightning } from "lucide-react";

const EIGEN_ADDRESSES = {
  proxyAdmin: "0xabb7b69189744d26e1105beeb95ae64b8b00c3de",
  delegation: "0x55a9b588f83978480f99e884ba81a724a88a3ac0",
  avsDirectory: "0x6660d56c82841fb4b7f9908fff2af06498c7b215",
  strategyManager: "0x4d7b24d39f34d1bc333ee73f5e9c4a256997eb29",
};

const OUR_ADDRESSES = {
  proxyAdmin: "0xe4f60f94edcaea35143f74f6f53a1cefa0153b0b",
  resolverServiceManager: "0x173786fa8fc30f4febafcb85fef99ca8efac8ec6",
  stakeRegistry: "0x2e174f3a203fe2dc4285dbb8a2d24f8ddaa87847",
  strategy: "0x56b6d9127bf2394ec31d4b5a357b57a1823e8879",
};

const OPERATORS = [
  {
    address: "0xA39a7105968d6F193c42Ac1995db54BAE6CE4024",
    avgValueRestaked: "1.3",
    avsCount: 1,
  },
  {
    address: "0x7C3B85A71E4fce1209A81D0A0C9C5E987A012102",
    avgValueRestaked: "0.8",
    avsCount: 1,
  },
];

export function Info() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <CloudLightning className="h-12 w-12 text-purple-500" />
          <span className="text-2xl font-bold text-white">ARN Stats</span>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Built on EigenLayer, providing a decentralized betting platform that leverages AVS
          for secure and transparent outcome resolution.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Operators"
          value={OPERATORS.length.toString()}
          subtitle="Active validators"
        />
        <StatCard
          title="Total Value Restaked"
          value="2.1"
          subtitle="ETH locked in protocol"
        />
        <StatCard
          title="Active AVS"
          value="1"
          subtitle="Running services"
        />
        <StatCard
          title="Network Uptime"
          value="99.9%"
          subtitle="Last 30 days"
        />
      </div>

      {/* Operators Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Active Operators</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Operator Address</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Value Restaked</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">AVS Count</th>
              </tr>
            </thead>
            <tbody>
              {OPERATORS.map((operator) => (
                <tr key={operator.address} className="border-b border-white/10 last:border-0">
                  <td className="p-4 text-sm font-mono text-purple-400">{operator.address}</td>
                  <td className="p-4 text-sm text-white">{operator.avgValueRestaked} ETH</td>
                  <td className="p-4 text-sm text-white">{operator.avsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">EigenLayer Contracts</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(EIGEN_ADDRESSES).map(([name, address]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <code className="text-purple-400 text-sm">{address}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">ARN Contracts</h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(OUR_ADDRESSES).map(([name, address]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <code className="text-purple-400 text-sm">{address}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
