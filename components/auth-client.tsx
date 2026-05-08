"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login-page";
import { sessionManager } from "@/lib/session";

export function AuthClient(props: { msal: { clientId: string; tenantId: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (sessionManager.isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  return <LoginPage onAuthenticated={() => router.replace("/")} msal={props.msal} />;
}

