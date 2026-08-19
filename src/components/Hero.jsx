import { HeroMini } from "./ui.jsx";

/**
 * On mobile the image comes first (order-1) so visitors see the product before
 * a wall of copy; on large screens it returns to the right-hand column where
 * the background photo takes over.
 */
export default function Hero() {
  return (
    <section data-hero-section className="relative overflow-hidden bg-sky-50">
      <div data-hero-backdrop className="absolute inset-0 hidden lg:block will-change-transform" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "image-set(url('/hero.webp') type('image/webp'), url('/hero.png') type('image/png'))" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(253,186,116,0.38),transparent_26%),linear-gradient(105deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.72)_56%,rgba(255,255,255,0.22)_78%,rgba(255,255,255,0.06)_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-10 lg:py-24">
        <div className="order-2 max-w-xl lg:order-1">
          <h1 data-hero-item className="text-4xl font-black leading-[1.08] tracking-tight text-blue-950 sm:text-5xl lg:text-7xl lg:leading-[1.05]">
            Smarter Solar. <span className="text-green-600">Stronger</span> Tomorrow.
          </h1>
          <p data-hero-item className="mt-5 text-lg leading-8 text-slate-700 lg:mt-7">
            <strong>ZEER Solar Solutions</strong> helps you take control of your energy with smart
            tools, accurate insights, and flexible financing. Build a cleaner, brighter, and more
            reliable future today.
          </p>

          <div data-hero-item className="mt-7 grid gap-5 sm:grid-cols-3 lg:mt-8">
            <HeroMini icon="bolt" title="Lower Bills" text="Save more every month" />
            <HeroMini icon="leaf" title="Clean Energy" text="For a better tomorrow" />
            <HeroMini icon="shield" title="Energy Security" text="Power when you need it" />
          </div>

          <div data-hero-item className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-9">
            <a
              href="#estimate"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-700 px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-700/25 transition hover:bg-blue-800"
            >
              Get Your Free Estimate
            </a>
            <a
              href="#tools"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-blue-700 shadow-lg transition hover:border-blue-200 hover:bg-blue-50"
            >
              Try the Solar Tools
            </a>
          </div>
        </div>

        <div data-hero-media className="order-1 lg:order-2 lg:min-h-[520px] will-change-transform">
          <picture>
            <source srcSet="/hero.webp" type="image/webp" />
            <img
              src="/hero.png"
              alt="Solar panels installed on the roof of a modern two-storey home"
              width="1600"
              height="1200"
              fetchpriority="high"
              className="aspect-[4/3] w-full rounded-3xl border border-white bg-white object-cover shadow-2xl shadow-slate-300/70 lg:hidden"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
