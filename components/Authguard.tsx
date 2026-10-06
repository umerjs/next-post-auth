"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import { BackendUrl } from "@/utils/core";
import { store } from "@/store/states";

const publicRoutes = ["/login", "/signup"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { isLogin, login, logout } = store();

  useEffect(() => {
    const isUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        logout();
        return;
      }

      try {
        const response = await axios.get(`${BackendUrl}/api/v1/profile`, {
          headers: {
            authorizedtoken: token,
          },
        });

        login(response.data.data);
      } catch (error) {
        console.error("Authentication failed:", error);

        localStorage.removeItem("token");
        logout();
      }
    };

    isUser();
  }, [login, logout]);

  useEffect(() => {
    if (isLogin === null) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (isLogin && isPublicRoute) {
      router.replace("/");
      return;
    }

    if (!isLogin && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isLogin, pathname, router]);

  if (isLogin === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
