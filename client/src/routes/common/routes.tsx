import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";

import TradingDashboard from "@/pages/trading";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import Billing from "@/pages/settings/billing";

import DashboardPreview from "@/pages/dashboard-preview";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.HOME, element: <Home /> },
  { path: PROTECTED_ROUTES.PREVIEW_DASHBOARD, element: <DashboardPreview /> },
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  {
    path: PROTECTED_ROUTES.TRANSACTIONS,
    element: <Transactions />,
  },

  {
    path: PROTECTED_ROUTES.TRADING,
    element: <TradingDashboard />,
  },
  {
    path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.SETTINGS, 
    element: <Settings /> ,
    children: [
      { index: true, element: <Account /> }, // Default route
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
      { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: <Billing /> },
    ]
  },
];
