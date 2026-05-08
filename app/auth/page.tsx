"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login-page";
import { sessionManager } from "@/lib/session";

export default function AuthPageRoute() {
  const router = useRouter();

  // If already authenticated, skip login and go straight to the app
  useEffect(() => {
    if (sessionManager.isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleAuthenticated = () => {
    router.replace("/");
  };

  return <LoginPage onAuthenticated={handleAuthenticated} />;
}
