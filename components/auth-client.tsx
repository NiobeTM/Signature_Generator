"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/components/login-page";
import { sessionManager } from "@/lib/session";
import { consumeRedirectLogin } from "@/lib/msalAuth";

/** Preload an image into the browser memory cache before navigating away. */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = async () => {
      // In incognito/private modes the URL may be fetched but not decoded yet.
      // decode() ensures the image is ready to paint as a CSS background.
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dec = (img as any).decode?.bind(img);
        if (dec) await dec();
      } catch {
        // ignore decode failures; still proceed
      }
      resolve();
    };
    img.onerror = () => resolve(); // don't block navigation on error
    img.src = src;
  });
}

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
          await preloadImage("/app-bg.png");
          if (cancelled) return;
          router.replace("/");
          return;
        }
      } catch {
        // ignore; user stays on login
      }

      if (cancelled) return;
      if (sessionManager.isAuthenticated()) {
        await preloadImage("/app-bg.png");
        if (cancelled) return;
        router.replace("/");
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

  return <LoginPage onAuthenticated={() => router.replace("/")} msal={props.msal} />;
}

