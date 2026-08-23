import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useTypedSelector } from "@/app/hook";
import { useDispatch } from "react-redux";
import { transactionApi } from "@/features/transaction/transactionAPI";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to the backend
    const socketInstance = io(import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:8000", {
      withCredentials: true,
      autoConnect: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected:", socketInstance.id);
      if (user?.id) {
         socketInstance.emit("join_user_room", user.id);
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for transaction updates
    socketInstance.on("transaction_update", (payload) => {
      console.log("Real-time transaction update received:", payload);
      // Invalidate RTK Query cache to trigger a refetch of transactions
      dispatch(transactionApi.util.invalidateTags(["transactions"]));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
