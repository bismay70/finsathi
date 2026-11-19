
import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  LockKeyhole,
} from "lucide-react";

const SignUp = () => {
  const dashboardBackground = "/assets/hero-image.png";

  return (
    <div className="grid h-svh overflow-hidden bg-zinc-50 text-zinc-950 lg:grid-cols-[50%_50%]">

      {/* Left Section - 40% */}
      <div className="flex h-full flex-col gap-8 overflow-hidden p-6 md:p-10">

        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <Logo url="/" />
        </div>

        {/* Signup Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm border border-zinc-200 bg-white p-8 shadow-sm">
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Right Section - 60% Full Background Image */}
      <div
        className="relative hidden h-full overflow-hidden bg-zinc-950 bg-cover bg-center bg-no-repeat text-white lg:block"
        style={{
          backgroundImage: `url(${dashboardBackground})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-zinc-950/50" />

        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(190,242,100,0.16),transparent_32%)]" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-10">

          {/* Heading */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-lime-200 backdrop-blur-sm">
              <LockKeyhole className="h-4 w-4" />
              Secure onboarding
            </div>

            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Create your FinSathi account and start from a clean dashboard.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-200">
              Set up AI receipt capture, transactions, analytics, and scheduled reports in one place.
            </p>
          </div>

          {/* Bottom Features */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-zinc-200">
              <BadgeCheck className="h-4 w-4 text-lime-300" />
              Receipt AI
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-200">
              <ChartNoAxesCombined className="h-4 w-4 text-lime-300" />
              Cash flow
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
