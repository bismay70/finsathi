import { 
  Bell, User, LayoutDashboard, Activity, Settings, 
  History, AlertTriangle, Video, MapPin, Home,
  DollarSign, TrendingUp, PieChart, ShieldAlert, LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPreview() {
  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-20">
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-black">Finsathi</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">WEALTH TERMINAL</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <Link to="/home" className="flex items-center gap-4 px-4 py-3 rounded-lg bg-black text-white font-bold">
            <Home className="w-5 h-5 text-[#CCFF00]" />
            Go Home
          </Link>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm">
            <PieChart className="w-5 h-5" />
            Portfolios
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm">
            <TrendingUp className="w-5 h-5" />
            Asset Tracking
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm">
            <LineChart className="w-5 h-5" />
            Market Feed
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold text-sm">
            <History className="w-5 h-5" />
            Trade History
          </a>
        </nav>
        
        <div className="px-6 pb-8 flex flex-col gap-4">
            <button className="w-full bg-[#5D3FD3] hover:bg-[#482EAA] text-white font-bold py-3.5 rounded-lg shadow-sm transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#CCFF00]" />
                MARKET ALERTS
            </button>
            <div className="flex flex-col gap-3 mt-4">
                <a href="#" className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                </a>
                <a href="#" className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    <div className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold">?</div>
                    Support
                </a>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-white">
        
        {/* Top Navigation */}
        {/* <header className="h-20 flex items-center justify-between px-8 flex-shrink-0 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center gap-12">
             <div className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1">Finsathi <span className="text-[#CCFF00]">✦</span></div>
             <nav className="flex gap-8 text-sm font-bold tracking-wide text-slate-500">
                <a href="#" className="text-black border-b-[3px] border-[#CCFF00] pb-1.5 pt-1.5">Overview</a>
                <a href="#" className="hover:text-slate-800 transition-colors py-1.5">Portfolios</a>
                <a href="#" className="hover:text-slate-800 transition-colors py-1.5">Asset Tracking</a>
                <a href="#" className="hover:text-slate-800 transition-colors py-1.5">Market Feed</a>
                <a href="#" className="hover:text-slate-800 transition-colors py-1.5">Trade History</a>
             </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="bg-black hover:bg-slate-800 text-[#CCFF00] text-[10px] font-bold px-4 py-2 rounded uppercase tracking-widest transition-colors">
              EXECUTE TRADE
            </button>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
               <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 relative bg-[#F8FAFC]/50">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            
            {/* Top Row: Metrics & Alert */}
            <div className="grid grid-cols-4 gap-6 h-[200px]">
                {/* Finance Feed Panel */}
                <div className="col-span-3 bg-black rounded-xl overflow-hidden shadow-sm relative group border border-slate-100 flex items-center justify-center">
                    <img 
                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover opacity-60"
                        alt="Market Feed"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-white text-[10px] font-bold tracking-widest uppercase border border-white/10 z-10">
                        <div className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00] animate-pulse"></div>
                        LIVE FEED: NASDAQ
                    </div>
                </div>

                {/* Alert Card */}
                <div className="bg-[#5D3FD3] rounded-xl p-6 shadow-md flex flex-col justify-between text-white relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 text-white/10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                        <ShieldAlert className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                            <Activity className="w-3 h-3 text-[#CCFF00]" />
                            AI INSIGHT ACTIVE
                        </div>
                        <h2 className="text-xl font-bold leading-tight mb-2">High Market<br/>Volatility Detected</h2>
                        <p className="text-xs text-purple-200 font-medium leading-relaxed max-w-[90%]">
                            Tech sector stocks showing abnormal volume. Portfolio Beta exceeded threshold by 12%.
                        </p>
                    </div>
                    <div className="flex gap-3 relative z-10 mt-4">
                        <button className="bg-white text-[#5D3FD3] font-bold text-[10px] px-4 py-2.5 rounded uppercase tracking-widest hover:bg-purple-50 transition-colors">
                            HEDGE PORTFOLIO
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Row: Streams */}
            <div className="grid grid-cols-3 gap-6 h-[260px]">
                {/* Real-Time Video Stream -> Real Time Chart */}
                <div className="col-span-2 bg-black rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col group">
                    <div className="absolute top-4 left-4 z-20 flex justify-between items-center w-[calc(100%-2rem)]">
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded text-white text-[10px] font-bold tracking-widest uppercase border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00] animate-pulse"></div>
                            AI ALGORITHMIC TRADING STREAM
                        </div>
                    </div>
                    
                    {/* Placeholder Chart */}
                    <div className="flex-1 w-full h-full relative z-10 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1642543492481-44e81e39148c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-80" alt="Chart" />
                        
                        {/* Popup for Trade Execution */}
                        <div className="absolute bottom-6 right-6 bg-[#CCFF00]/90 backdrop-blur-md border border-lime-400 p-4 rounded-xl shadow-2xl z-30 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-black text-[#CCFF00] flex items-center justify-center shrink-0">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-black font-bold text-xs tracking-widest uppercase mb-0.5">OPPORTUNITY DETECTED</h4>
                                <p className="text-slate-800 text-[10px] font-bold tracking-wider">AUTO-TRADE INITIATED</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Stream */}
                <div className="col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative group">
                    <div className="h-[75%] relative overflow-hidden bg-black flex items-center justify-center">
                         <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                            alt="Bloomberg terminal"
                        />
                        {/* Overlay Badge */}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-white border border-white/20 flex items-center gap-1.5 uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></div>
                            REC • BLOOMBERG LIVE
                        </div>
                    </div>
                    <div className="h-[25%] p-4 flex items-center justify-between bg-white">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">Federal Reserve Announcement</h4>
                            <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Impact: High Volatility Expected</p>
                        </div>
                        <Video className="w-5 h-5 text-[#5D3FD3]" />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Map & Priorities */}
            <div className="grid grid-cols-3 gap-6 h-[340px]">
                
                {/* Active Assets Map */}
                <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                    <div className="p-5 flex justify-between items-center border-b border-slate-100 z-10 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-black flex items-center justify-center">
                                <MapPin className="w-3 h-3 text-[#5D3FD3]" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm tracking-wide">Global Asset Distribution</h3>
                        </div>
                        <div className="flex gap-3">
                            <span className="bg-[#CCFF00]/20 text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">32 Active Markets</span>
                        </div>
                    </div>
                    
                    {/* Simulated Map Background */}
                    <div className="flex-1 bg-[#E2E8F0] relative overflow-hidden group">
                        {/* Map Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
                        
                        {/* Location Markers */}
                        <div className="absolute top-[40%] left-[42%] bg-black text-white px-2 py-1 rounded shadow-md border border-slate-800 text-[8px] font-bold z-20 whitespace-nowrap">
                            LONDON - LSE
                        </div>
                        <div className="absolute top-[45%] left-[45%] w-8 h-8 bg-[#CCFF00] rounded-full flex items-center justify-center border-2 border-black shadow-lg z-20 animate-pulse">
                            <DollarSign className="w-4 h-4 text-black" />
                        </div>
                    </div>
                </div>

                {/* Top Gainers List */}
                <div className="col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Top Portfolio Gainers</h3>
                        <a href="#" className="text-[#5D3FD3] text-[10px] font-bold uppercase tracking-widest hover:underline">View All</a>
                    </div>
                    
                    <div className="flex flex-col gap-4 flex-1">
                        {/* Asset 1 */}
                        <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-lg transition-colors">
                            <div className="w-12 h-12 rounded-full border-2 border-[#CCFF00] shadow-sm flex items-center justify-center text-xl font-bold bg-black text-white">A</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 text-sm">AAPL</span>
                                    <span className="text-[9px] font-bold text-black uppercase tracking-widest bg-[#CCFF00] px-1.5 py-0.5 rounded">+12.4%</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Technology • Strong Buy</div>
                            </div>
                        </div>
                        
                        {/* Asset 2 */}
                        <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-lg transition-colors">
                            <div className="w-12 h-12 rounded-full border-2 border-[#5D3FD3] shadow-sm flex items-center justify-center text-xl font-bold bg-white text-slate-800">T</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-800 text-sm">TSLA</span>
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-[#5D3FD3] px-1.5 py-0.5 rounded">+8.2%</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Automotive • Hold</div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-black hover:bg-slate-800 text-[#CCFF00] font-bold py-3 rounded-lg transition-colors text-xs uppercase tracking-widest flex justify-center items-center gap-2">
                        BUY ASSETS
                    </button>
                </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
