import { useId } from "react";
import Icon from "./Icon.jsx";

const TOOL_VARIANTS = {
  blue: {
    badge: "bg-blue-100 text-blue-700",
    title: "text-blue-700",
    accent: "accent-blue-600",
    panel: "bg-blue-50",
    panelLabel: "text-blue-900",
    figure: "text-blue-700",
  },
  green: {
    badge: "bg-green-100 text-green-700",
    title: "text-green-700",
    accent: "accent-green-600",
    panel: "bg-green-50",
    panelLabel: "text-green-800",
    figure: "text-green-700",
  },
  orange: {
    badge: "bg-orange-100 text-orange-600",
    title: "text-orange-600",
    accent: "accent-orange-500",
    panel: "bg-orange-50",
    panelLabel: "text-orange-700",
    figure: "text-orange-600",
  },
};

export const variantFor = (color) => TOOL_VARIANTS[color] ?? TOOL_VARIANTS.blue;

export function ToolCard({ color, icon, title, subtitle, children }) {
  const variant = variantFor(color);

  return (
    <section data-animate data-tilt className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70 will-change-transform">
      <div className="mb-6 flex items-start gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${variant.badge}`}>
          <Icon name={icon} size="lg" />
        </div>
        <div>
          <h3 className={`text-xl font-black ${variant.title}`}>{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

/**
 * A labelled range slider.
 *
 * The visible label is tied to the input with htmlFor/id so screen readers
 * announce it, and `aria-valuetext` makes them read the formatted display
 * ("₱8,500") instead of the raw number. The `range-input` class in index.css
 * gives the thumb a 44px touch target.
 */
export function RangeInput({ label, value, min, max, step, onChange, display, color, unitHint }) {
  const id = useId();
  const variant = variantFor(color);

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-slate-700">
        <label htmlFor={id}>{label}</label>
        <span className="text-blue-950">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${display}${unitHint ? ` ${unitHint}` : ""}`}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`range-input w-full ${variant.accent}`}
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400" aria-hidden="true">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function SelectRow({ label, value, options, onChange }) {
  const id = useId();

  return (
    <div className="mb-5 flex items-center justify-between gap-4 text-sm font-bold text-slate-700">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[44px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-blue-950 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

/**
 * A segmented choice rendered as buttons, used for loan term and brownout
 * duration. Wrapped in a radiogroup so the set is announced as one control.
 */
export function OptionRow({ label, value, options, onChange, format, color }) {
  const variant = variantFor(color);
  const selectedClasses =
    color === "green"
      ? "border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/25"
      : "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25";
  const hoverBorder = color === "green" ? "hover:border-green-300" : "hover:border-orange-300";

  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-700">
        <span id={`${label}-legend`}>{label}</span>
        <span className={variant.figure}>{format(value)}</span>
      </div>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-labelledby={`${label}-legend`}>
        {options.map((option) => {
          const isSelected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className={`min-h-[44px] rounded-lg border px-2 text-sm font-bold transition ${
                isSelected ? selectedClasses : `border-slate-200 bg-white text-slate-600 ${hoverBorder}`
              }`}
            >
              {format(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Metric({ label, value, accent = "text-blue-950" }) {
  return (
    <div className="border-r border-slate-200 px-1 last:border-r-0">
      <p>{label}</p>
      <p className={`mt-2 text-lg font-black ${accent}`}>{value}</p>
    </div>
  );
}

export function HeroMini({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-md">
        <Icon name={icon} />
      </div>
      <div>
        <p className="font-black text-blue-950">{title}</p>
        <p className="mt-1 text-xs text-slate-600">{text}</p>
      </div>
    </div>
  );
}

export function TrustBlock({ icon, title, text }) {
  return (
    <div data-animate className="flex gap-4 rounded-2xl p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <Icon name={icon} size="lg" />
      </div>
      <div>
        <h3 className="font-black text-blue-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

export function ServicePoint({ icon, title, text }) {
  return (
    <div data-animate className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Icon name={icon} />
      </div>
      <h3 className="mt-4 font-black text-blue-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
