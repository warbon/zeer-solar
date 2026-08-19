import Icon from "./Icon.jsx";
import { ServicePoint, TrustBlock } from "./ui.jsx";
import { contact } from "../config.js";
import { galleryItems, services, testimonials, trustBlocks } from "../data.js";

export function Services() {
  return (
    <section aria-labelledby="services-heading" className="bg-white px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Visually hidden: keeps the heading order H1 -> H2 -> H3 intact
            without changing the design. */}
        <h2 id="services-heading" className="sr-only">
          What ZEER Solar provides
        </h2>
        <div data-animate-group className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServicePoint key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="bg-white px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 id="how-heading" className="sr-only">
          Why homeowners choose ZEER Solar
        </h2>
        <div data-animate-group className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 md:grid-cols-4">
          {trustBlocks.map((block) => (
            <TrustBlock key={block.title} {...block} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="bg-slate-50 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-green-600">
              Photo Gallery
            </p>
            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Actual works in action.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-700">
            A quick look at rooftop preparation, installation work, completed panel arrays, and
            solar systems serving local homes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {galleryItems.map((item, index) => (
            <figure
              key={item.image}
              data-gallery-item
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl bg-blue-950 shadow-xl shadow-slate-300/50 ${
                index < 2 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <picture>
                <source srcSet={`${item.image}.webp`} type="image/webp" />
                <img
                  src={`${item.image}.jpg`}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/25 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="mb-3 inline-flex rounded-full bg-green-600 px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
                  {item.tag}
                </p>
                <h3 className="text-xl font-black leading-tight">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold text-blue-50">{item.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-green-600">
              Customer Stories
            </p>
            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Testimonials from solar customers.
            </h2>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
            <p className="text-lg leading-8 text-slate-700">
              Real-world concerns usually start with bill savings, brownout protection, and budget
              clarity. These customer stories show how ZEER Solar can speak to each one.
            </p>
          </div>
        </div>

        <div data-animate-group className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              data-animate
              className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="flex items-center gap-1 text-orange-500">
                  <span className="sr-only">Rated 5 out of 5</span>
                  <span aria-hidden="true" className="text-lg leading-none">
                    ★★★★★
                  </span>
                </p>
                <p className="rounded-full bg-blue-50 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-blue-700">
                  {testimonial.metric}
                </p>
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-7 text-slate-700">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-black text-green-700"
                >
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="min-w-0">
                  <span className="block font-black text-blue-950">{testimonial.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">{testimonial.role}</span>
                  <span className="mt-1 block text-sm font-semibold text-green-700">
                    {testimonial.location}
                  </span>
                </span>
              </figcaption>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-blue-950 px-6 py-20 text-white lg:px-10"
    >
      <div className="absolute inset-x-0 top-0 h-10 rounded-b-[100%] bg-white" aria-hidden="true" />
      <div data-animate className="mx-auto max-w-5xl text-center">
        <h2 className="text-4xl font-black">Solar decisions should be simple.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
          ZEER Solar Solutions combines consultation, estimation tools, financing guidance, and
          energy security planning so customers can move to solar with confidence.
        </p>
        <a
          href="#estimate"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-green-500 px-8 py-4 font-bold text-white shadow-xl shadow-green-500/20 transition hover:bg-green-600"
        >
          Request a Free Estimate
        </a>
      </div>
    </section>
  );
}

export function Contact() {
  const items = [
    {
      icon: "phone",
      title: "Phone",
      body: (
        <a className="mt-2 block text-slate-600 hover:text-blue-700" href={contact.phoneHref}>
          {contact.phone}
        </a>
      ),
    },
    {
      icon: "mail",
      title: "Email",
      body: (
        <>
          <p className="mt-2 font-semibold text-slate-700">
            {contact.personTitle} {contact.personName}
          </p>
          <a
            className="mt-1 block break-words text-slate-600 hover:text-blue-700"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
        </>
      ),
    },
    {
      icon: "map",
      title: "Location",
      body: (
        <>
          <p className="mt-2 text-slate-600">
            {contact.street}, {contact.city}
          </p>
          <p className="mt-2 text-slate-600">Philippines, {contact.postalCode}</p>
        </>
      ),
    },
  ];

  return (
    <section id="contact" className="bg-white px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-blue-950 sm:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-slate-600">Have questions? We'd love to hear from you.</p>
        </div>
        <div data-animate-group className="mt-10 grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} data-animate className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Icon name={item.icon} />
              </div>
              <h3 className="mt-4 font-bold text-blue-950">{item.title}</h3>
              {item.body}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
