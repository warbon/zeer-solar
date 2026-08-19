import { contact, developer, site, social } from "../config.js";
import { navLinks } from "../data.js";

/**
 * Studio credit. The ACWare lockup has dark type on a transparent background,
 * so it sits on a light chip to stay legible against the dark blue footer.
 * Falls back to a text credit if no logo is configured.
 */
function DeveloperCredit() {
  const mark = developer.logo ? (
    // `contents` stops <picture> generating its own box, and `max-w-none` on
    // the image defeats preflight's `max-width:100%`, which otherwise resolves
    // against a flex container sized by this very image and collapses it to 0.
    <picture className="contents">
      <source srcSet={developer.logo} type="image/webp" />
      <img
        src={developer.logoFallback || developer.logo}
        alt={`${developer.name}${developer.tagline ? ` ${developer.tagline}` : ""}`}
        width={developer.logoWidth}
        height={developer.logoHeight}
        loading="lazy"
        decoding="async"
        className="h-7 w-auto max-w-none"
      />
    </picture>
  ) : (
    <span className="font-bold text-white">{developer.name}</span>
  );

  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span className="text-blue-200">Designed and developed by</span>
      {developer.logo ? (
        <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 shadow-sm">
          {mark}
        </span>
      ) : (
        mark
      )}
    </span>
  );

  if (!developer.url) return <p className="text-xs">{content}</p>;

  return (
    <p className="text-xs">
      <a
        href={developer.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-md transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {content}
      </a>
    </p>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const channels = [
    social.messenger && { href: social.messenger, label: "Messenger" },
    social.facebook && { href: social.facebook, label: "Facebook" },
    social.viber && { href: social.viber, label: "Viber" },
  ].filter(Boolean);

  return (
    <footer className="bg-blue-950 px-6 py-14 text-blue-100 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            {/* The ZEER mark is full colour on a transparent ground, so it
                needs a light chip here rather than a brightness/invert filter,
                which would flatten it to a white block. */}
            <span className="inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm">
              <img
                src="/zeer-logo.webp"
                alt={site.name}
                width="440"
                height="135"
                className="h-10 w-auto max-w-none"
              />
            </span>
            <p className="mt-4 max-w-sm text-sm leading-6">
              Solar consultation, installation support, financing guidance, and backup planning for
              homes across Cebu.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a className="hover:text-white hover:underline" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Contact</h2>
            <address className="mt-4 space-y-2 text-sm not-italic">
              <p>
                {contact.personTitle} {contact.personName}
              </p>
              <p>
                <a className="hover:text-white hover:underline" href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </p>
              <p>
                <a className="break-words hover:text-white hover:underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </p>
              <p>
                {contact.street}, {contact.city}, Philippines {contact.postalCode}
              </p>
            </address>

            {channels.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20"
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {channel.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-xs leading-6 text-blue-200">
          <p>
            <strong className="text-white">Privacy:</strong> details you submit through the estimate
            form are used only to prepare and discuss your solar proposal. They are never sold or
            shared with third parties. To have your information removed, email{" "}
            <a className="underline hover:text-white" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            .
          </p>
          <p className="mt-3">
            Estimates shown on this site are planning figures. They assume roughly 5 peak sun hours
            per day for Cebu, a ₱13.00/kWh retail tariff, and ₱5.50/kWh for energy exported under
            ERC net metering. Actual production, savings, and financing terms depend on a site
            assessment, your utility's prevailing rates, and bank approval.
          </p>
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <DeveloperCredit />
          </div>
        </div>
      </div>
    </footer>
  );
}
