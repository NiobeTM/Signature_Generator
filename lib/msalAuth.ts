import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { getMsalConfig, loginRequest } from "./msalConfig";

let msalInstance: PublicClientApplication | null = null;
let msalInitialized: Promise<void> | null = null;

export async function getMsalInstance(): Promise<PublicClientApplication | null> {
  const msalConfig = getMsalConfig();

  if (!msalConfig) {
    console.error(
      "Azure AD not configured. Please set NEXT_PUBLIC_AZURE_AD_CLIENT_ID and NEXT_PUBLIC_AZURE_AD_TENANT_ID"
    );
    return null;
  }

  if (!msalInstance) {
    try {
      msalInstance = new PublicClientApplication(msalConfig);
      msalInitialized = msalInstance.initialize();
    } catch (error) {
      console.error("Failed to create MSAL instance:", error);
      return null;
    }
  }

  if (msalInitialized) {
    try {
      await msalInitialized;
      msalInitialized = null;
    } catch (error) {
      console.error("Failed to initialize MSAL:", error);
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

export async function loginWithMicrosoft(): Promise<MicrosoftUserInfo | null> {
  try {
    const msal = await getMsalInstance();

    if (!msal) {
      throw new Error("MSAL not configured. Please configure Azure AD credentials.");
    }

    // Clear any stale interaction lock left by a previous failed/cancelled attempt
    Object.keys(sessionStorage)
      .filter((key) => key.includes("interaction.status"))
      .forEach((key) => sessionStorage.removeItem(key));

    const response = await msal.loginPopup({
      ...loginRequest,
      redirectUri: window.location.origin,
      prompt: "select_account",
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
