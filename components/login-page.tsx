"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isMsalCryptoContextReady, loginWithMicrosoftOrRedirect } from "@/lib/msalAuth";
import { sessionManager } from "@/lib/session";

interface LoginPageProps {
  onAuthenticated: () => void;
  msal?: {
    clientId?: string;
    tenantId?: string;
  };
}

export function LoginPage({ onAuthenticated, msal }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const clientId = msal?.clientId || process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "";
  const tenantId = msal?.tenantId || process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("error") === "non_elkak") {
      setError("Access denied. Only @elkak.gr Microsoft accounts are allowed.");
      window.history.replaceState({}, "", "/auth");
      return;
    }
    if (clientId && tenantId && !isMsalCryptoContextReady()) {
      setError(
        "Microsoft sign-in requires a secure browser page (https://, or http://localhost for local dev). Plain http:// with a computer name or LAN address cannot use Web Crypto."
      );
    }
  }, [clientId, tenantId]);

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await loginWithMicrosoftOrRedirect({ clientId, tenantId });

      if (result === "redirect") {
        return;
      }

      const user = result;

      if (!user || !user.email) {
        setError("Authentication returned no account. Please try again.");
        return;
      }

      if (!user.email.toLowerCase().endsWith("@elkak.gr")) {
        setError(`Access denied. Account "${user.email}" is not an @elkak.gr account.`);
        return;
      }

      sessionManager.createSession(user.email, user.displayName || user.email);
      // Ensure the background image is in cache before navigating so there is no black flash.
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = async () => {
          try {
            // decode() ensures the image is ready to paint (helps incognito/private modes).
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dec = (img as any).decode?.bind(img);
            if (dec) await dec();
          } catch {
            // ignore
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = "/app-bg.png";
      });
      onAuthenticated();
    } catch (err: unknown) {
      const msalError = err as { errorCode?: string; message?: string };
      if (msalError?.errorCode === "user_cancelled") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (msalError?.errorCode === "crypto_nonexistent") {
        setError(
          "This page is not a secure context, so the browser cannot run Microsoft sign-in. Open the app with https:// or use http://localhost for development."
        );
      } else {
        setError(`Sign-in error: ${msalError?.errorCode || msalError?.message || String(err)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-black/10 p-10 flex flex-col items-center gap-8"
        style={{ backgroundColor: "#84868C" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/elkak-logo-header.png"
            alt="ΕΛΚΑΚ Logo"
            width={120}
            height={60}
            style={{ objectFit: "contain", mixBlendMode: "screen" }}
            unoptimized
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-white leading-tight">
              Email Signature Generator
            </h1>
            {/* <p className="text-sm text-white/70 mt-1">
              Γεννήτρια Υπογραφής Email
            </p> */}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20" />

        {/* Sign-in section */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-white font-medium">Sign in to continue</p>
            <p className="text-white/60 text-sm mt-1">
              Use your ΕΛΚΑΚ Microsoft account
            </p>
          </div>

          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 active:bg-white/80 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                {/* Microsoft logo */}
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>

          {error && (
            <p className="text-red-300 text-sm text-center bg-red-900/30 rounded-lg px-4 py-2 w-full">
              {error}
            </p>
          )}
        </div>

        {/* Footer note */}
        <p className="text-white/40 text-xs text-center">
          Access restricted to @elkak.gr accounts only.
        </p>
      </div>
    </div>
  );
}
