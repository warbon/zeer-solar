import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * All scroll and entrance animation for the landing page.
 *
 * Three safeguards keep content from ever being stranded invisible, since
 * every reveal starts from opacity 0:
 *
 * 1. Nothing is hidden by CSS. Initial states are set with `gsap.set` inside a
 *    layout effect, which runs after DOM mutation but *before* the browser
 *    paints -- so there is no flash, and if the bundle never executes the page
 *    still renders fully readable rather than a blank hero.
 *
 * 2. A hidden document is left completely alone until it becomes visible.
 *    Background tabs, prerenders and preview crawlers pause requestAnimationFrame,
 *    so anything hidden up front would never animate back in.
 *
 * 3. Reduced motion short-circuits before any state is set, so those visitors
 *    get the plain document with no transforms left behind.
 */
export function useLandingAnimations(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    let context;

    const start = () => {
      context = buildTimeline(root);
    };

    // A hidden document -- a background tab, a prerender, a preview crawler --
    // pauses requestAnimationFrame. Anything we hid up front would never be
    // animated back in and would sit invisible indefinitely. So we hide nothing
    // until the page is actually on screen.
    if (typeof document !== "undefined" && document.hidden) {
      const onVisible = () => {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onVisible);
        start();
      };
      document.addEventListener("visibilitychange", onVisible);
      return () => {
        document.removeEventListener("visibilitychange", onVisible);
        context?.revert();
      };
    }

    start();

    // Layout settles after fonts and images land; refresh so triggers sit right.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      context?.revert();
    };
  }, [rootRef]);
}

function buildTimeline(root) {
  return gsap.context(() => {
    const reveals = gsap.utils.toArray("[data-animate]");
    const heroItems = gsap.utils.toArray("[data-hero-item]");

    // --- initial states, applied pre-paint -------------------------------
    gsap.set(heroItems, { y: 28, opacity: 0 });
    gsap.set("[data-hero-media]", { scale: 1.04, opacity: 0 });
    reveals.forEach((el) => gsap.set(el, { y: 32, opacity: 0 }));

    // --- hero entrance ----------------------------------------------------
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .to(heroItems, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 })
      .to("[data-hero-media]", { scale: 1, opacity: 1, duration: 1.0 }, "-=0.65");

    // --- section reveals --------------------------------------------------
    // Grouped elements stagger together; standalone ones animate on their own.
    gsap.utils.toArray("[data-animate-group]").forEach((group) => {
      const items = gsap.utils.toArray(group.querySelectorAll("[data-animate]"));
      if (!items.length) return;

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 82%", once: true },
      });
    });

    reveals
      .filter((el) => !el.closest("[data-animate-group]"))
      .forEach((el) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

    // --- gallery: clip reveal plus a slow image settle --------------------
    gsap.utils.toArray("[data-gallery-item]").forEach((item) => {
      const image = item.querySelector("img");

      gsap.fromTo(
        item,
        { clipPath: "inset(12% 0% 12% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 84%", once: true },
        }
      );

      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 84%", once: true },
          }
        );
      }
    });

    // --- header: condense once the hero is behind us ----------------------
    const header = root.querySelector("[data-site-header]");
    if (header) {
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        onUpdate: (self) => header.classList.toggle("is-condensed", self.scroll() > 80),
        onToggle: (self) => header.classList.toggle("is-condensed", self.isActive),
      });
    }

    // --- desktop-only flourishes -----------------------------------------
    const mq = gsap.matchMedia();

    mq.add("(min-width: 1024px) and (pointer: fine)", () => {
      // Gentle parallax on the hero backdrop.
      gsap.to("[data-hero-backdrop]", {
        yPercent: 8,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Tool cards lift and tilt toward the cursor. Listener teardown is
      // collected here and returned from the matchMedia callback -- returning
      // it from the forEach would silently discard it and leak the listeners.
      const tiltCleanups = [];

      gsap.utils.toArray("[data-tilt]").forEach((card) => {
        const quickX = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
        const quickY = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

        const onMove = (event) => {
          const b = card.getBoundingClientRect();
          quickX(((event.clientX - b.left) / b.width - 0.5) * 5);
          quickY(((event.clientY - b.top) / b.height - 0.5) * -5);
        };
        const onEnter = () =>
          gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out", transformPerspective: 900 });
        const onLeave = () => {
          quickX(0);
          quickY(0);
          gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);

        tiltCleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => tiltCleanups.forEach((fn) => fn());
    });

    return () => {
      intro.kill();
      mq.revert();
    };
  }, root);
}
