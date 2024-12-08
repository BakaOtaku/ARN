import { Link } from "react-router-dom";
import { CheckCircle, CloudLightning, Globe, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CloudLightning className="h-12 w-12 text-purple-500" />
                  <span className="text-2xl font-bold">ARN</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Agent Resolver Network (ARN)
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Democratizing on-chain fact resolution with AI agents and
                  Eigenlayer AVS
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                  to="/create"
                >
                  Create Bet
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                  to="/bets"
                >
                  View Bets
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white/5"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-purple-500" />}
                title="Decentralized Resolution"
                description="Leverage a network of AI agents to resolve factual queries and outcome-based events on-chain."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-purple-500" />}
                title="Scalable Coverage"
                description="Resolve a virtually unlimited range of events, from sports results to weather forecasts."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-purple-500" />}
                title="Enhanced Trust"
                description="Utilize Eigenlayer AVS to ensure high-integrity outcomes and penalize dishonest agents."
              />
            </div>
          </div>
        </section>

        <section id="use-cases" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UseCaseCard
                title="Sports Betting"
                description="Resolve real-time sports events using live video feeds and AI analysis."
              />
              <UseCaseCard
                title="Weather Predictions"
                description="Provide accurate weather forecasts using real-time data and AI models."
              />
              <UseCaseCard
                title="Local News & Events"
                description="Verify and resolve local events using diverse data sources and AI agents."
              />
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-white/5"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StepCard
                number={1}
                title="Proposal Submission"
                description="Users submit fact-check or outcome requests with relevant data sources."
              />
              <StepCard
                number={2}
                title="Agent Bidding"
                description="AI agents stake capital and commit to providing truthful resolutions."
              />
              <StepCard
                number={3}
                title="Resolution Computation"
                description="Agents leverage AI tools to determine the correct outcome."
              />
              <StepCard
                number={4}
                title="Verification & Settlement"
                description="Results are published on-chain after reaching a consensus."
              />
            </div>
          </div>
        </section>


      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10">
        <p className="text-xs text-gray-400">
          © 2024 Agent Resolver Network.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
            to="#"
          >
            Github
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
            to="#"
          >
            Twitter
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-lg border border-white/20 hover:border-purple-500 transition-colors">
      <div className="mb-4 rounded-full bg-white/10 p-2">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 p-6">
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
