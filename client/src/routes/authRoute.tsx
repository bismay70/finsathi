import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath";

const AuthRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken && user && accessToken !== "mock-token");

  if (isAuthenticated) {
    return <Navigate to={PROTECTED_ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
