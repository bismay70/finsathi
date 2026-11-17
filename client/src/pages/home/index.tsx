import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  FileScan,
  LineChart,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const workflows = [
  {
    title: "Personal Wealth Dashboard",
    href: "/overview",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "AI Receipt Scanning",
    href: "/transactions",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Intelligent Reports",
    href: "/reports",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Trading Simulator",
    href: "/trading",
    image:
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Firebase Auth",
    description: "Protected sessions for private finance workflows.",
  },
  {
    icon: FileScan,
    title: "AI Receipt Capture",
    description: "Upload receipts and turn spending into structured records.",
  },
  {
    icon: BarChart3,
    title: "Financial Analytics",
    description: "Track cash flow, expenses, and report history at a glance.",
  },
];

const stats = [
  { label: "Workflows", value: "6" },
  { label: "AI tools", value: "3" },
  { label: "Reports", value: "24/7" },
];

function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-7rem)] overflow-hidden bg-zinc-950 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/finsathi.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="FinSathi product preview"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.92)_0%,rgba(3,7,18,0.72)_42%,rgba(3,7,18,0.32)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[var(--max-width)] flex-col justify-center px-5 py-16 lg:px-14">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-lime-200 backdrop-blur">
            <LineChart className="h-4 w-4" />
            AI finance, analytics, reports, and trading in one workspace
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Finsathi brings your money story into focus.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            Track expenses, scan receipts, generate monthly reports, and explore simulated trading from a calm, secure finance dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-lime-300 text-zinc-950 hover:bg-lime-200">
              <Link to="/overview">
                Open Dashboard
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              <a href="#workflows">View Workflows</a>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid max-w-3xl grid-cols-3 border-y border-white/15 bg-zinc-950/35 backdrop-blur md:max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-4">
              <p className="text-2xl font-bold text-lime-200">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  return (
    <section className="bg-zinc-950 px-5 py-14 text-white lg:px-14">
      <div className="mx-auto grid max-w-[var(--max-width)] grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div key={feature.title} className="border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-lime-300 text-zinc-950">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkflowsSection() {
  return (
    <section id="workflows" className="bg-zinc-100 px-5 py-20 text-zinc-950 lg:px-14">
      <div className="mx-auto max-w-[var(--max-width)]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              <WalletCards className="h-4 w-4" />
              Core flows
            </p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Everything opens from one finance home.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-600">
            Move from daily expense work into AI reports, trading practice, and dashboard review without changing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {workflows.map((workflow) => (
            <Link
              to={workflow.href}
              key={workflow.title}
              className="group relative flex min-h-[320px] overflow-hidden bg-zinc-900 p-7"
            >
              <img
                src={workflow.image}
                alt={workflow.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-transparent" />
              <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-4">
                <h3 className="max-w-xs text-2xl font-bold leading-tight text-white md:text-3xl">
                  {workflow.title}
                </h3>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-zinc-950 transition group-hover:bg-lime-300">
                  <ChevronRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 px-5 py-10 text-sm text-zinc-400 lg:px-14">
      <div className="mx-auto flex max-w-[var(--max-width)] flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-semibold text-white">Finsathi</p>
          <p className="mt-1">AI-powered personal finance and wealth management.</p>
        </div>
        <p>Copyright {new Date().getFullYear()} Finsathi. All rights reserved.</p>
      </div>
    </footer>
  );
}

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-950 selection:bg-lime-300 selection:text-zinc-950">
      <HeroSection />
      <FeatureShowcase />
      <WorkflowsSection />
      <Footer />
    </div>
  );
};

export default Home;
