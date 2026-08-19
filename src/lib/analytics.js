import { analytics } from "../config.js";

let scriptLoaded = false;

/**
 * Injects the Plausible script once, if a domain is configured.
 * No domain means no script and no network requests.
 */
export function initAnalytics() {
  if (scriptLoaded || !analytics.plausibleDomain || typeof document === "undefined") return;

  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = analytics.plausibleDomain;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
  scriptLoaded = true;
}

/**
 * Records a named event. Safe to call whether or not analytics is configured --
 * it degrades to a no-op so call sites never need a guard.
 */
export function trackEvent(name, props = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.plausible === "function") {
    window.plausible(name, { props });
    return;
  }

  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${name}`, props);
  }
}

/**
 * Fires an event the first time a given tool is touched, so the funnel shows
 * which calculator actually drives estimate requests.
 */
export function createFirstTouchTracker() {
  const seen = new Set();

  return (toolName) => {
    if (seen.has(toolName)) return;
    seen.add(toolName);
    trackEvent("Tool Engaged", { tool: toolName });
  };
}
