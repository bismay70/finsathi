import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

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

function UseCasesSection() {
  return (
    <section className="bg-white w-full" id="dashboards">
      {/* 2 Column Grid acting like a premium bento box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-white p-1">
        {useCases.map((useCase, index) => (
          <Link
            to={useCase.href}
            key={index}
            className="group relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex flex-col justify-end p-8 md:p-12 block"
          >
            {/* Background Image / Video */}
            <div className="absolute inset-0 z-0">
              <img
                src={useCase.image}
                alt={useCase.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-sans font-bold text-white leading-[1.1] tracking-tight mb-8">
                {useCase.title}
              </h2>

              <button className="flex items-center gap-3 px-6 py-3 border border-white/30 rounded-md text-white font-medium text-sm hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm pointer-events-none">
                See Feature
                <ArrowUpRight className="size-4" />
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
      <div className="absolute inset-0 flex flex-col items-center pt-[5vw] z-0 opacity-20 pointer-events-none">
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
            className="relative bg-black/45 backdrop-blur-md p-6 rounded-2xl border border-white/20 transition-transform hover:scale-105"
          >
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={card.img} 
                alt={card.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#CCFF00]/50"
              />
              <div>
                <p className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest mb-1">
                  Verified User: {card.name}
                </p>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {card.incident}
                </h3>
              </div>
            </div>

            <p className="text-gray-200 text-sm mt-2 leading-relaxed">
              "{card.desc}"
            </p>

            <div className="mt-6 flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>{card.location}</span>
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
    <div className="bg-white font-sans text-black selection:bg-[#CCFF00] selection:text-black rounded-xl border border-gray-100 shadow-sm overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-end pb-16">
        <video 
          src="/finsathi.mp4#t=1" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        <div className="relative z-10">
          <Link to="/overview">
            <Button size="lg" className="rounded-md bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 text-sm font-semibold text-white shadow-sm hover:bg-white/20 uppercase tracking-widest">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <UseCasesSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Home;
