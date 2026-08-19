import { useEffect, useRef } from "react";
import gsap from "gsap";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Tweens between values as the estimator inputs change.
 *
 * Three details that matter:
 *
 * - `formatter` is held in a ref, not a dependency. Call sites pass inline
 *   arrow functions, so a fresh identity arrives on every render; depending on
 *   it would restart the tween continuously while a slider is being dragged.
 * - The live value is tracked in `onUpdate`, so an interrupted tween resumes
 *   from where it actually is rather than snapping back to the last settled
 *   number.
 * - React renders an empty span and GSAP owns the text, so the two never fight
 *   over the same text node. The formatted value is mirrored into `aria-label`
 *   for assistive tech, and the span is `aria-live="off"` so screen readers are
 *   not spammed with every intermediate frame.
 */
export default function AnimatedNumber({ value, formatter, className = "" }) {
  const elementRef = useRef(null);
  const formatterRef = useRef(formatter);
  const currentRef = useRef(Number(value) || 0);

  formatterRef.current = formatter;

  // Paint the initial value synchronously so nothing flashes empty.
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    if (!el.textContent) {
      el.textContent = formatterRef.current(currentRef.current);
      el.setAttribute("aria-label", el.textContent);
    }
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return undefined;

    const next = Number(value) || 0;
    const write = (n) => {
      const text = formatterRef.current(n);
      el.textContent = text;
      el.setAttribute("aria-label", text);
    };

    if (prefersReducedMotion()) {
      currentRef.current = next;
      write(next);
      return undefined;
    }

    const state = { n: currentRef.current };
    const tween = gsap.to(state, {
      n: next,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        currentRef.current = state.n;
        write(state.n);
      },
      onComplete: () => {
        currentRef.current = next;
        write(next);
      },
    });

    return () => tween.kill();
  }, [value]);

  return <span ref={elementRef} className={className} aria-live="off" />;
}
