import { AuthClient } from "@/components/auth-client";

export default function AuthPageRoute() {
  const clientId = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "";
  const tenantId = process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || "";

  return <AuthClient msal={{ clientId, tenantId }} />;
}
