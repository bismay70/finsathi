import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";
import dashboardImg from "../../assets/images/dashboard_.png";
import dashboardImgDark from "../../assets/images/dashboard_dark.png";
import { useTheme } from "@/context/theme-provider";
import { BadgeCheck, ChartNoAxesCombined, LockKeyhole } from "lucide-react";

const SignIn = () => {
  const { theme } = useTheme();

  return (
    <div className="grid min-h-svh bg-zinc-50 text-zinc-950 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Logo url="/" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm border border-zinc-200 bg-white p-8 shadow-sm">
            <SignInForm />
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-zinc-950 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(190,242,100,0.16),transparent_32%)]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-lime-200">
              <LockKeyhole className="h-4 w-4" />
              Secure finance workspace
            </div>
            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Sign in to your AI-powered personal finance dashboard.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-300">
              See expenses, reports, transactions, and trading tools from one focused FinSathi workspace.
            </p>
          </div>

          <div className="relative mt-10 min-h-[420px] overflow-hidden border border-white/10 bg-white/5">
            <img
              src={theme === "dark" ? dashboardImgDark : dashboardImg}
              alt="Dashboard"
              className="absolute left-0 top-0 h-full w-full object-cover object-left-top"
            />
            <div className="absolute inset-x-0 bottom-0 flex gap-3 bg-zinc-950/80 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-zinc-200">
                <BadgeCheck className="h-4 w-4 text-lime-300" />
                Reports
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-200">
                <ChartNoAxesCombined className="h-4 w-4 text-lime-300" />
                Analytics
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
