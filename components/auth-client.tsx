"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login-page";
import { sessionManager } from "@/lib/session";
import { consumeRedirectLogin } from "@/lib/msalAuth";
import { preloadAppBackground } from "@/lib/preloadAppBackground";

export function AuthClient(props: { msal: { clientId: string; tenantId: string } }) {
  const router = useRouter();
  const [redirectChecked, setRedirectChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Finish sign-in after loginRedirect() (required on iOS Safari — popup often causes hash_empty_error)
      try {
        const user = await consumeRedirectLogin(props.msal);
        if (cancelled) return;
        if (user?.email) {
          if (!user.email.toLowerCase().endsWith("@elkak.gr")) {
            router.replace("/auth?error=non_elkak");
            setRedirectChecked(true);
            return;
          }
          sessionManager.createSession(
            user.email,
            user.displayName || user.email,
            user.msalHomeAccountId
          );
          await preloadAppBackground();
          if (cancelled) return;
          // Full navigation (same as manual refresh). Client `router.replace("/")` can leave the
          // background layer unpainted on some Windows/Chrome + Next.js SPA transitions.
          window.location.assign("/");
          return;
        }
      } catch {
        // ignore; user stays on login
      }

      if (cancelled) return;
      if (sessionManager.isAuthenticated()) {
        await preloadAppBackground();
        if (cancelled) return;
        window.location.assign("/");
        return;
      }
      setRedirectChecked(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, props.msal.clientId, props.msal.tenantId]);

  if (!redirectChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center text-white/70 text-sm">Signing in…</div>
      </div>
    );
  }

  return (
    <LoginPage
      onAuthenticated={async () => {
        await preloadAppBackground();
        window.location.assign("/");
      }}
      msal={props.msal}
    />
  );
}

