import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateCredentials } from "@/features/auth/authSlice";
import { auth } from "@/lib/firebase";

const useAuthExpiration = () => {
  const {
    accessToken,
    expiresAt,
  } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLogout = () => {
      console.log("Token expired, logging out...");
      dispatch(logout());
    };

    const handleTokenRefresh = async () => {
        try {
          const currentUser = auth.currentUser;

          if (!currentUser) {
            handleLogout();
            return;
          }

          const tokenResult = await currentUser.getIdTokenResult(true);
          dispatch(updateCredentials({
            accessToken: tokenResult.token,
            expiresAt: new Date(tokenResult.expirationTime).getTime(),
          }));
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Token refresh failed, logging out...", error);
          handleLogout();
        }
      };

    if (accessToken === "mock-token") {
      handleLogout();
      return;
    }

    if (accessToken && expiresAt) {
        const currentTime = Date.now();
        const refreshOffsetMs = 1000 * 60;
        const timeUntilRefresh = expiresAt - currentTime - refreshOffsetMs;
      if (timeUntilRefresh <= 0) {
        handleTokenRefresh()
      } else {
        const timer = setTimeout(handleTokenRefresh, timeUntilRefresh);
        return () => clearTimeout(timer);
      }
    }
  }, [accessToken, dispatch, expiresAt]);
};

export default useAuthExpiration;
