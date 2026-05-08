import { Configuration, PopupRequest } from "@azure/msal-browser";

type MsalEnv = { clientId?: string; tenantId?: string };

export function getMsalConfig(env?: MsalEnv): Configuration | null {
  const clientId = env?.clientId ?? process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;
  const tenantId = env?.tenantId ?? process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID;

  if (!clientId || !tenantId) {
    console.warn("Azure AD configuration missing. Microsoft login will not work.");
    return null;
  }

  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3018";

  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri,
      postLogoutRedirectUri: redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
    system: {
      // MSAL v4 BrowserSystemOptions does not support allowNativeBroker
    },
  };
}

export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "email", "profile"],
};
