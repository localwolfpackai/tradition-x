"use client";

import { useEffect, useState } from "react";

type BipEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "txi_install_dismissed";

export default function InstallHint() {
  const [visible, setVisible] = useState(false);
  const [native, setNative] = useState<BipEvent | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setNative(e as BipEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    const t = window.setTimeout(() => setVisible(true), 1100);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      clearTimeout(t);
    };
  }, []);

  if (!visible) return null;

  const onInstall = async () => {
    if (native) {
      await native.prompt();
      await native.userChoice;
      setVisible(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="install-hint" onClick={native ? onInstall : undefined} role={native ? "button" : undefined}>
      <div className="ih-ico" aria-hidden="true">
        ⛳
      </div>
      <div className="ih-text">
        {native ? (
          <>
            <b>Install Tradition XI.</b> Tap to add it to your home screen — runs fullscreen and works without signal at the course.
          </>
        ) : (
          <>
            <b>Install the app.</b> Tap <b>Share</b>, then <b>Add to Home Screen</b> — runs fullscreen and works without signal at the course.
          </>
        )}
      </div>
      <button
        className="ih-close"
        aria-label="Dismiss"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        ×
      </button>
    </div>
  );
}
