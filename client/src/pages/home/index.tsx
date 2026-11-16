import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Shield, Zap, BarChart3, ChevronRight } from "lucide-react";

const useCases = [
  {
    title: "Personal Wealth Dashboard",
    href: "/overview",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "AI Receipt Scanning",
    href: "/transactions",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Intelligent Reports",
    href: "/reports",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Seamless Transactions",
    href: "/transactions",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
  },
];

function HeroSection() {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-[#CCFF00]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-50 z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#CCFF00] text-sm font-medium mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
          </span>
          Introducing Finsathi AI 2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-8">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-green-400">Wealth</span><br />
          With Intelligence
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          The all-in-one AI financial SaaS platform that helps you track expenses, scan receipts, and generate intelligent reports to achieve financial freedom.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Link to="/overview">
            <Button size="lg" className="rounded-full bg-[#CCFF00] hover:bg-[#b3e600] text-black px-8 py-6 text-base font-bold shadow-[0_0_40px_rgba(204,255,0,0.3)] transition-all hover:scale-105 group">
              Go to Dashboard
              <ArrowUpRight className="ml-2 size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold backdrop-blur-md transition-all">
              Explore Features
            </Button>
          </a>
        </div>
      </div>
      
      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </div>
  );
}

function FeatureShowcase() {
  const features = [
    { icon: <Shield className="size-6 text-[#CCFF00]" />, title: "Bank-Grade Security", desc: "Your financial data is encrypted and stored with the highest security standards." },
    { icon: <Zap className="size-6 text-[#CCFF00]" />, title: "Real-time AI Analysis", desc: "Instant insights on your spending habits with our advanced AI engine." },
    { icon: <BarChart3 className="size-6 text-[#CCFF00]" />, title: "Smart Reporting", desc: "Generate comprehensive visual reports to understand your cash flow." }
  ];

  return (
    <section id="features" className="bg-white py-24 w-full">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 group">
            <div className="p-3 bg-black rounded-xl mb-6 shadow-md group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="bg-white w-full pb-24" id="dashboards">
      <div className="max-w-6xl mx-auto px-6 mb-12">
         <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Powerful Workflows</h2>
         <p className="text-zinc-500 text-lg max-w-2xl">Discover how Finsathi can transform your financial life with tailored solutions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-6">
        {useCases.map((useCase, index) => (
          <Link
            to={useCase.href}
            key={index}
            className="group relative h-[50vh] md:h-[60vh] w-full rounded-3xl overflow-hidden flex flex-col justify-end p-8 md:p-10 block"
          >
            {/* Background Image / Video */}
            <div className="absolute inset-0 z-0">
              <img
                src={useCase.image}
                alt={useCase.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/40 to-black/90 group-hover:to-black/95 transition-colors" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                {useCase.title}
              </h2>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#CCFF00] transition-colors pointer-events-none">
                Explore Now
                <ChevronRight className="size-4" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-50 bg-[#09090b] text-zinc-400 py-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
        
        {/* BRAND + TAGLINE + CONTACT */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-zinc-100 font-bold text-3xl tracking-tight">Finsathi</span>
              <span className="text-[#CCFF00] text-xl">✦</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm text-zinc-300">
              AI-powered Personal Finance & Wealth Management Platform
            </p>
            <div className="text-xs text-zinc-400 flex flex-wrap gap-2 items-center mb-8">
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00]/30 transition-colors cursor-default">Smart Insights</span>
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00]/30 transition-colors cursor-default">AI Scanning</span>
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00]/30 transition-colors cursor-default">Secure</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-zinc-100 mb-4 uppercase tracking-wider text-xs">Contact & Support</h4>
            <a href="mailto:support@finsathi.com" className="flex items-center gap-3 hover:text-[#CCFF00] transition-colors group">
               <svg className="w-4 h-4 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
               support@finsathi.com
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="md:pl-4">
          <h4 className="font-semibold text-zinc-100 mb-6 tracking-wide text-sm">Quick Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            {['Overview', 'Transactions', 'Reports', 'Settings'].map((link) => (
              <li key={link}>
                <Link to={`/${link.toLowerCase()}`} className="text-zinc-400 hover:text-[#CCFF00] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* FEATURES */}
        <div>
          <h4 className="font-semibold text-zinc-100 mb-6 tracking-wide text-sm">Solutions</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-400">
            <li className="hover:text-zinc-200 transition-colors cursor-default">AI Receipt Scanner</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Expense Tracking</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Budget Management</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Income Analytics</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">CSV Imports</li>
          </ul>
        </div>

        {/* USE CASES */}
        <div>
          <h4 className="font-semibold text-zinc-100 mb-6 tracking-wide text-sm">Use Cases</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-400">
            <li className="hover:text-zinc-200 transition-colors cursor-default">Personal Wealth</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Freelancers</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Small Business</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Households</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Students</li>
          </ul>
        </div>

        {/* TRUST & COMPLIANCE */}
        <div>
          <h4 className="font-semibold text-zinc-100 mb-6 tracking-wide text-sm">Trust & Security</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-400">
            <li className="hover:text-zinc-200 transition-colors cursor-default">Secure Authentication</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Encrypted Data</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">99.9% System Uptime</li>
            <li className="hover:text-zinc-200 transition-colors cursor-default">Privacy Compliance</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR - LEGAL */}
      <div className="border-t border-white/5 mt-16 pt-8 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-zinc-500">
        <p>© {new Date().getFullYear()} Finsathi. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/#" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link to="/#" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

const testimonialCards = [
  {
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    name: "Sarah Jenkins",
    incident: "Achieved Financial Freedom",
    desc: "Finsathi helped me organize my investments and reach my retirement goals 5 years early.",
    location: "New York, NY",
    time: "2 years using Finsathi"
  },
  {
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    name: "David Chen",
    incident: "Business Growth Scaled",
    desc: "The automated receipt scanning and expense tracking saved my startup hundreds of hours.",
    location: "San Francisco, CA",
    time: "1 year using Finsathi"
  }
];

function TestimonialSection() {
  return (
    <section className="bg-[#050508] overflow-hidden relative py-24">
      <div className="absolute inset-0 flex flex-col items-center pt-[5vw] z-0 opacity-10 pointer-events-none">
        <h1 className="text-white text-[15vw] font-bold leading-none tracking-tighter">
          Real
        </h1>
        <h1 className="text-[#CCFF00] text-[15vw] font-bold leading-none tracking-tighter">
          Wealth
        </h1>
        <h1 className="text-white text-[15vw] font-bold leading-none tracking-tighter">
          Stories
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonialCards.map((card, index) => (
          <div
            key={index}
            className="relative bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-[#CCFF00]/30 transition-all duration-300 hover:-translate-y-2 group"
          >
            <div className="flex items-start gap-5 mb-6">
              <img 
                src={card.img} 
                alt={card.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#CCFF00]/50 group-hover:border-[#CCFF00] transition-colors"
              />
              <div>
                <p className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest mb-1">
                  Verified User: {card.name}
                </p>
                <h3 className="text-white font-bold text-xl leading-tight">
                  {card.incident}
                </h3>
              </div>
            </div>

            <p className="text-gray-300 text-base leading-relaxed">
              "{card.desc}"
            </p>

            <div className="mt-8 flex items-center justify-between text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {card.location}
              </span>
              <span>{card.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const Home = () => {
  return (
    <div className="bg-white font-sans text-black selection:bg-[#CCFF00] selection:text-black rounded-xl border border-gray-100 shadow-sm overflow-y-auto h-[calc(100vh-4rem)] scroll-smooth">
      <HeroSection />
      <FeatureShowcase />
      <UseCasesSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Home;
