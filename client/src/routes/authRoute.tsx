import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath";

const AuthRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);

  // BYPASS AUTHENTICATION FOR DEVELOPMENT: always redirect from auth pages to home
  return <Navigate to={PROTECTED_ROUTES.HOME} replace />;
};

export default AuthRoute;
