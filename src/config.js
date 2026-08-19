/**
 * Everything about the business that appears on the site.
 *
 * Change values here rather than hunting through components. Anything marked
 * TODO needs a real value before launch.
 */

export const site = {
  name: "ZEER Solar Solutions",
  // TODO: replace with the live domain. Used for canonical URLs, Open Graph
  // tags and the sitemap -- social previews break if this is wrong.
  url: "https://zeersolar.com",
  tagline: "Solar Estimates and Backup Planning",
  description:
    "ZEER Solar Solutions helps Cebu homeowners estimate solar savings, compare financing, plan backup power, and request a free solar assessment.",
};

export const contact = {
  personName: "Everard Arbon",
  personTitle: "Mr.",
  email: "arboneverard1145@gmail.com",
  phone: "+63 969 106 8846",
  phoneHref: "tel:+639691068846",
  street: "Talisay",
  city: "Cebu City",
  region: "Cebu",
  postalCode: "6045",
  country: "PH",
};

/**
 * Social and messaging channels. Messenger and Viber matter more than email
 * for most Philippine customers -- fill these in and they render automatically.
 */
export const social = {
  // TODO: set to the page's m.me handle, e.g. "https://m.me/zeersolar"
  messenger: "",
  // TODO: set to the Facebook page URL
  facebook: "",
  // TODO: set to a viber:// deep link if the business uses Viber
  viber: "",
};

/**
 * Where the lead form posts.
 *
 * Paste an endpoint from Formspree (https://formspree.io), Web3Forms or any
 * service that accepts a JSON POST. While this is empty the form falls back to
 * opening the visitor's email client, which captures nothing -- so setting this
 * is the single highest-impact change you can make.
 */
export const leadForm = {
  // TODO: e.g. "https://formspree.io/f/xxxxxxxx"
  endpoint: "",
};

/**
 * Optional privacy-friendly analytics. Set `domain` to enable the Plausible
 * script; events fire through `trackEvent` either way (no-op when disabled).
 */
export const analytics = {
  // TODO: e.g. "zeersolar.com"
  plausibleDomain: "",
};

/**
 * Studio credit shown in the footer.
 *
 * `logo` is optional: drop the file into /public and point at it (e.g.
 * "/acware-logo.png" or "/acware-logo.webp"). While it is empty the credit
 * renders as text only, so nothing breaks and no broken image appears.
 */
export const developer = {
  name: "ACWare",
  tagline: "I.T. Solutions",
  url: "https://acware.org/",
  logo: "/acware-logo.webp",
  logoFallback: "/acware-logo.png",
  logoWidth: 256,
  logoHeight: 81,
};

export const isLeadEndpointConfigured = () => Boolean(leadForm.endpoint);
