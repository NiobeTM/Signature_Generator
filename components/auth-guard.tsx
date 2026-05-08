"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sessionManager } from "@/lib/session";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Bypass auth on localhost for development
    // if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    //   setIsChecking(false);
    //   return;
    // }

    // Auth page itself never needs guarding
    if (pathname === "/auth") {
      setIsChecking(false);
      return;
    }

    if (!sessionManager.isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/app-bg.png')", backgroundSize: "cover" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/70 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
