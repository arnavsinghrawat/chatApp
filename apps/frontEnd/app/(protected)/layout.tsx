"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { RootState, AppDispatch } from "store/store";
import { setAuth } from "store/authSlice";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      dispatch(setAuth({ token, user: JSON.parse(userData) }));
    } else {
      
      router.push("/login");
    }
  }, [dispatch, router]);

  if (!authUser) return null;

  return <>{children}</>;
}
