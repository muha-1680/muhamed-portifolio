"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "darkMode";

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !dark;
    document.body.classList.toggle("dark-mode", next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
    // The storage event does not fire on the tab that made the change.
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <button className="dark-toggle" onClick={toggle} aria-label="Toggle dark mode">
      <i className={dark ? "fas fa-sun" : "fas fa-moon"}></i>{" "}
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}