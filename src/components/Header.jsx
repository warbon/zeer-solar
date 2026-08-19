import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import { navLinks } from "../data.js";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Escape closes the menu and returns focus to the button that opened it,
  // so keyboard users are never stranded inside a dismissed panel.
  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (mobileNavOpen) panelRef.current?.querySelector("a")?.focus();
  }, [mobileNavOpen]);

  const closeNav = () => setMobileNavOpen(false);

  return (
    <header data-site-header className="sticky top-0 z-50 transition-shadow duration-300 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <a href="#home" className="flex items-center gap-3" aria-label="ZEER Solar Solutions, home">
          <img
            src="/zeer-logo.webp"
            alt=""
            width="440"
            height="135"
            className="h-11 w-auto sm:h-14"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 text-sm font-semibold text-slate-700 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className={
                link.href === "#home"
                  ? "border-b-2 border-blue-600 pb-1 text-blue-700"
                  : "hover:text-blue-700"
              }
              href={link.href}
              aria-current={link.href === "#home" ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#estimate"
          className="hidden min-h-[44px] items-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:inline-flex"
        >
          Get Free Estimate
        </a>

        <button
          ref={toggleRef}
          type="button"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-blue-950 lg:hidden"
        >
          <Icon name={mobileNavOpen ? "close" : "menu"} />
        </button>
      </div>

      {mobileNavOpen && (
        <nav
          id="mobile-nav"
          ref={panelRef}
          aria-label="Mobile"
          className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 text-sm font-bold text-slate-700 sm:grid-cols-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeNav}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-3 hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#estimate"
              onClick={closeNav}
              className="col-span-2 flex min-h-[44px] items-center justify-center rounded-lg bg-blue-700 px-3 py-3 text-center text-white hover:bg-blue-800 sm:col-span-3"
            >
              Get Free Estimate
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
