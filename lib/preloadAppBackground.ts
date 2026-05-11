/** Same URL as layout + globals — keep one string. */
export const APP_BG_SRC = "/app-bg.png";

/**
 * Wait until the background image can be painted (fetch + decode).
 * Used before client navigations to `/` so the fixed background `<img>` can show immediately.
 */
export function preloadAppBackground(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = async () => {
      try {
        await img.decode();
      } catch {
        // decode() optional / may reject; onload still means pixels are available in many engines
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = APP_BG_SRC;
  });
}
