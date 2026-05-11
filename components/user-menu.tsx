"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { sessionManager } from "@/lib/session";
import { logoutMicrosoftRedirect } from "@/lib/msalAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(nameOrEmail: string): string {
  const s = (nameOrEmail || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const session = sessionManager.getSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = session?.displayName || "";
  const email = session?.email || "";

  const initials = useMemo(() => getInitials(displayName || email), [displayName, email]);

  if (!session?.isAuthenticated) return null;

  const signOut = async () => {
    setIsSigningOut(true);
    sessionManager.clearSession();

    try {
      // Full-page redirect to Microsoft logout + back to /auth.
      await logoutMicrosoftRedirect();
      return;
    } catch {
      // If MSAL isn't available, at least exit the app session.
      router.replace("/auth");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full text-white hover:bg-white/10"
          aria-label="User menu"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/20 ring-1 ring-white/20">
            <span className="text-xs font-semibold">{initials}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel className="space-y-0.5">
          <div className="flex items-center gap-2">
            <User className="size-4" />
            <span className="truncate">{displayName || email}</span>
          </div>
          {displayName && email && <div className="text-muted-foreground text-xs truncate pl-6">{email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (!isSigningOut) void signOut();
          }}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

