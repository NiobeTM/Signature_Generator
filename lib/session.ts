export interface SessionData {
  isAuthenticated: boolean;
  email: string;
  displayName: string;
  /** Used to target the exact MSAL account on logout (avoid account picker). */
  msalHomeAccountId?: string;
  timestamp: number;
}

const SESSION_KEY = "elkak_sig_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export const sessionManager = {
  createSession: (email: string, displayName: string, msalHomeAccountId?: string): void => {
    const data: SessionData = {
      isAuthenticated: true,
      email,
      displayName,
      msalHomeAccountId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  },

  getSession: (): SessionData | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data: SessionData = JSON.parse(raw);
      if (Date.now() - data.timestamp > SESSION_TTL_MS) {
        sessionManager.clearSession();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  clearSession: (): void => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    const session = sessionManager.getSession();
    return session?.isAuthenticated === true;
  },
};
