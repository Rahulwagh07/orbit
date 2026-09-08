"use client";

import { useAuth } from "../AuthProvider";

export function useLaunch() {
  const { user, isLoading } = useAuth();
  const label = !isLoading && user ? "Open your computer" : "Launch a computer";
  const launch = () => {
    window.location.href = !isLoading && user ? "/computer" : "/login";
  };
  return { launch, label, isLoading };
}
