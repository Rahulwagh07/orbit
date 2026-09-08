"use client";

import { useAuth } from "../AuthProvider";
import { useLoginModal } from "./LoginModal";

export function useLaunch() {
  const { user, isLoading } = useAuth();
  const { openLogin } = useLoginModal();
  const label = !isLoading && user ? "Open your computer" : "Launch a computer";
  const shortLabel = !isLoading && user ? "Open your computer" : "Sign in";
  const launch = () => {
    if (!isLoading && user) {
      window.location.href = "/computer";
    } else {
      openLogin();
    }
  };
  return { launch, label, shortLabel, isLoading };
}
