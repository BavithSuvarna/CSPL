import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import AuctionPage from './pages/AuctionPage';
import ResultsPage from './pages/ResultsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import UnsoldPage from './pages/UnsoldPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Enhanced Navigation Bar */}
      <nav className="p-6 bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🏆</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-red-400 bg-clip-text text-transparent">
              CSPL 2k25
            </h1>
          </div>
          
          <div className="flex gap-8">
            <Link 
              to="/" 
              className="relative px-4 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              Upload
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/auction" 
              className="relative px-4 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              Auction
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/results" 
              className="relative px-4 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              Results
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/team/:id" element={<TeamDetailsPage />} />
        <Route path="/unsold" element={<UnsoldPage />} />
      </Routes>
    </BrowserRouter>
  );
}