import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { getMsalConfig, loginRequest } from "./msalConfig";

let msalInstance: PublicClientApplication | null = null;
let msalInitialized: Promise<void> | null = null;

/**
 * MSAL uses Web Crypto (`crypto.subtle`). Browsers only expose it in a "secure context":
 * https://, http://localhost, http://127.0.0.1 (varies), etc.
 * Plain http:// with a hostname or LAN IP → `crypto_nonexistent` from MSAL.
 */
export function isMsalCryptoContextReady(): boolean {
  if (typeof window === "undefined") return true;
  return Boolean(window.isSecureContext && globalThis.crypto?.subtle);
}

function throwMsalUnavailable(msalConfigPresent: boolean): never {
  if (!msalConfigPresent) {
    throw new Error("MSAL not configured. Please configure Azure AD credentials.");
  }
  if (typeof window !== "undefined" && !isMsalCryptoContextReady()) {
    throw new Error(
      "Microsoft sign-in needs a secure page: use https:// or, for local dev, http://localhost (not http:// plus an IP or machine name)."
    );
  }
  throw new Error("MSAL failed to initialize. Check the browser console and Azure AD settings.");
}

export async function getMsalInstance(env?: { clientId?: string; tenantId?: string }): Promise<PublicClientApplication | null> {
  const msalConfig = getMsalConfig(env);

  if (!msalConfig) {
    console.error(
      "Azure AD not configured. Please set NEXT_PUBLIC_AZURE_AD_CLIENT_ID and NEXT_PUBLIC_AZURE_AD_TENANT_ID"
    );
    return null;
  }

  if (typeof window !== "undefined" && !isMsalCryptoContextReady()) {
    console.error(
      "MSAL requires a secure browser context (https:// or http://localhost) so Web Crypto is available."
    );
    return null;
  }

  if (!msalInstance) {
    try {
      msalInstance = new PublicClientApplication(msalConfig);
      msalInitialized = msalInstance.initialize();
    } catch (error) {
      console.error("Failed to create MSAL instance:", error);
      msalInstance = null;
      msalInitialized = null;
      return null;
    }
  }

  if (msalInitialized) {
    try {
      await msalInitialized;
      msalInitialized = null;
    } catch (error) {
      console.error("Failed to initialize MSAL:", error);
      msalInstance = null;
      msalInitialized = null;
      return null;
    }
  }

  return msalInstance;
}

export interface MicrosoftUserInfo {
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

function getMsalErrorCode(err: unknown): string {
  if (!err || typeof err !== "object") return "";
  const e = err as { errorCode?: string; error?: string; message?: string };
  return (e.errorCode || e.error || "").toString();
}

/** Try popup first; on known popup failures (e.g. hash_empty_error), fall back to full-page redirect. */
export function shouldFallbackToRedirectAfterPopupError(err: unknown): boolean {
  const code = getMsalErrorCode(err);
  return (
    code === "hash_empty_error" ||
    code === "empty_window_error" ||
    code === "popup_window_error" ||
    code === "monitor_window_timeout" ||
    code === "block_iframe_error"
  );
}

/** Try popup first; on known popup failures, continue with loginRedirect (same device, Safari and “Chrome” on iOS both use WebKit). */
export async function loginWithMicrosoftOrRedirect(
  env?: { clientId?: string; tenantId?: string }
): Promise<MicrosoftUserInfo | null | "redirect"> {
  try {
    return await loginWithMicrosoft(env);
  } catch (err) {
    if (shouldFallbackToRedirectAfterPopupError(err)) {
      await loginRedirectMicrosoft(env);
      return "redirect";
    }
    throw err;
  }
}

function clearStaleInteractionLock(): void {
  if (typeof sessionStorage === "undefined") return;
  Object.keys(sessionStorage)
    .filter((key) => key.includes("interaction.status"))
    .forEach((key) => sessionStorage.removeItem(key));
}

function getSpaRedirectUri(): string {
  return `${window.location.origin}/auth`;
}

/** After Microsoft redirects back to /auth, call this once to finish sign-in. */
export async function consumeRedirectLogin(env?: {
  clientId?: string;
  tenantId?: string;
}): Promise<MicrosoftUserInfo | null> {
  const msal = await getMsalInstance(env);
  if (!msal) return null;
  try {
    const response = await msal.handleRedirectPromise();
    if (response?.account) {
      return getUserInfoFromAccount(response.account);
    }
  } catch (e) {
    console.error("handleRedirectPromise error:", e);
  }
  return null;
}

export async function loginRedirectMicrosoft(env?: { clientId?: string; tenantId?: string }): Promise<void> {
  const configOk = !!getMsalConfig(env);
  const msal = await getMsalInstance(env);
  if (!msal) {
    throwMsalUnavailable(configOk);
  }
  clearStaleInteractionLock();
  await msal.loginRedirect({
    ...loginRequest,
    redirectUri: getSpaRedirectUri(),
    prompt: "select_account",
  });
}

export async function loginWithMicrosoft(env?: { clientId?: string; tenantId?: string }): Promise<MicrosoftUserInfo | null> {
  try {
    const configOk = !!getMsalConfig(env);
    const msal = await getMsalInstance(env);

    if (!msal) {
      throwMsalUnavailable(configOk);
    }

    clearStaleInteractionLock();

    const response = await msal.loginPopup({
      ...loginRequest,
      redirectUri: getSpaRedirectUri(),
    });

    if (response && response.account) {
      return getUserInfoFromAccount(response.account);
    }

    return null;
  } catch (error) {
    console.error("Microsoft login error:", error);
    throw error;
  }
}

function getUserInfoFromAccount(account: AccountInfo): MicrosoftUserInfo {
  const email = account.username || "";
  const nameParts = (account.name || "").split(" ");
  return {
    email,
    displayName: account.name || "",
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
  };
}

export async function logoutMicrosoft(): Promise<void> {
  try {
    const msal = await getMsalInstance();
    if (!msal) return;

    const accounts = msal.getAllAccounts();
    if (accounts.length > 0) {
      await msal.logoutPopup({ account: accounts[0] });
    }
  } catch (error) {
    console.error("Microsoft logout error:", error);
  }
}
