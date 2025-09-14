'use client';

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import { RootState, AppDispatch } from "store/store";
import { hydrateAuth, setAuth } from "store/authSlice";
import { setOnlineUsers, clearSocket } from "store/socketSlice";
import { initSocket, getSocket, disconnectSocket } from "utils/socket";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Block render until auth check

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);

      dispatch(hydrateAuth({ token, user: parsedUser }));

      const socket = initSocket(token, parsedUser._id);

      socket.on("getOnlineUsers", (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      setLoading(false);

      return () => {
        socket.off("getOnlineUsers"); 
        disconnectSocket();          
        dispatch(clearSocket());
      };

    } else {
      router.replace("/login"); // redirect if no token
    }
  }, [dispatch, router]);

  if (loading || !authUser) return null;

  return <>{children}</>;
}
