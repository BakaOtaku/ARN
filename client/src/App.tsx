import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { CreateBet } from "./pages/CreateBet";
import { Info } from "./pages/Info";
import { ActiveBets } from "./pages/ActiveBets";
import Home from "./pages/Home";
import { Providers } from "./Providers";
import '@rainbow-me/rainbowkit/styles.css';

export function App() {
  return (
    <Providers>
      <Router>
        <div className="min-h-screen bg-[#2A3335] text-white">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/create" element={<CreateBet />} />
              <Route path="/bets" element={<ActiveBets />} />
              <Route path="/info" element={<Info />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Providers>
  );
}

export default App;
