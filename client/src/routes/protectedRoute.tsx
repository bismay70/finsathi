import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath";

const ProtectedRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken && user && accessToken !== "mock-token");

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
