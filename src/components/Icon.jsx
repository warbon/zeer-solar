const PATHS = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  leaf: <><path d="M20 3C12 4 5 9 4 20c9-1 16-8 16-17Z" /><path d="M4 20c4-6 8-9 14-13" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  panel: <><path d="M4 5h16l-2 14H2L4 5Z" /><path d="M6 9h13M5 13h13M9 5 7 19M14 5l-2 14" /></>,
  calculator: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 11v2M10 9l-2 4h3l-1 3 4-5h-3l1-2Z" /></>,
  award: <><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" /></>,
  tools: <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-3 3-3-3 3-3Z" />,
  earth: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  map: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chat: <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0Z" />,
  check: <path d="m5 13 4 4L19 7" />,
};

const SIZES = { md: "h-5 w-5", lg: "h-8 w-8" };

/**
 * Decorative by default: `aria-hidden` keeps icons out of the accessibility
 * tree so they are not announced alongside the text they sit next to. Pass a
 * `title` only when the icon is the sole meaning of a control.
 */
export default function Icon({ name, size = "md", title }) {
  const decorative = !title;

  return (
    <svg
      className={SIZES[size] ?? SIZES.md}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative || undefined}
      focusable="false"
      role={decorative ? undefined : "img"}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name] ?? PATHS.bolt}
    </svg>
  );
}
