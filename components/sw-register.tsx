"use client";

import { useEffect } from "react";

/**
 * Mount once in the root layout to register the offline service worker.
 * Silent on failure — SW is a progressive enhancement, never a hard requirement.
 */
export default function SwRegister(): null {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async (): Promise<void> => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // NOTE: swallow — offline cache is a nice-to-have, not load-bearing.
      }
    };

    void register();
  }, []);

  return null;
}
