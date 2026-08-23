import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath";

import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken || !user) {
      dispatch(
        setCredentials({
          accessToken: "mock-token",
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          user: {
            id: 1,
            name: "Mock User",
            email: "mock@example.com",
            profilePicture: "",
          },
          reportSetting: null,
        })
      );
    }
  }, [accessToken, user, dispatch]);

  // BYPASS AUTHENTICATION FOR DEVELOPMENT
  return <Outlet />;
};

export default ProtectedRoute;
