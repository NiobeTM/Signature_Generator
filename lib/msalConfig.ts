import { Configuration, PopupRequest } from "@azure/msal-browser";

export function getMsalConfig(): Configuration | null {
  const clientId = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;
  const tenantId = process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID;

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
      allowNativeBroker: false,
    },
  };
}

export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "email", "profile"],
};
