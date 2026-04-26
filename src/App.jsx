import React, { useMemo, useState } from "react";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#tools", label: "Solutions" },
  { href: "#estimate", label: "Estimate" },
  { href: "#how", label: "How It Works" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact" },
];

function calculateSolarEstimate({ monthlyBill, dailyUsage, roofArea, systemCost, downPayment, loanYears, interestRate, batterySize, essentialLoad, brownoutHours }) {
  const safeMonthlyBill = Math.max(0, Number(monthlyBill) || 0);
  const safeDailyUsage = Math.max(1, Number(dailyUsage) || 1);
  const safeRoofArea = Math.max(10, Number(roofArea) || 10);
  const safeSystemCost = Math.max(100000, Number(systemCost) || 100000);
  const safeDownPayment = Math.min(50, Math.max(0, Number(downPayment) || 0));
  const safeLoanYears = Math.max(1, Number(loanYears) || 1);
  const safeInterestRate = Math.max(0, Number(interestRate) || 0);
  const safeBatterySize = Math.max(1, Number(batterySize) || 1);
  const safeEssentialLoad = Math.max(0.5, Number(essentialLoad) || 0.5);
  const safeBrownoutHours = Math.max(1, Number(brownoutHours) || 1);

  const billBasedKw = safeMonthlyBill / 1650;
  const usageBasedKw = safeDailyUsage / 4;
  const roofCapacityKw = safeRoofArea / 8;
  const desiredSystemKw = Math.max(1.5, billBasedKw, usageBasedKw);
  const systemKw = Math.min(20, roofCapacityKw, desiredSystemKw);
  const monthlySavings = safeMonthlyBill * 0.5;
  const paybackYears = monthlySavings > 0 ? safeSystemCost / (monthlySavings * 12) : 0;
  const financedAmount = safeSystemCost * (1 - safeDownPayment / 100);
  const monthlyInterest = safeInterestRate / 100 / 12;
  const termMonths = safeLoanYears * 12;
  const monthlyPayment = monthlyInterest === 0
    ? financedAmount / termMonths
    : financedAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, termMonths)) / (Math.pow(1 + monthlyInterest, termMonths) - 1);
  const totalPayment = monthlyPayment * termMonths + safeSystemCost * (safeDownPayment / 100);
  const totalInterest = Math.max(0, totalPayment - safeSystemCost);
  const backupRuntime = safeBatterySize / safeEssentialLoad;
  const backupConfidence = backupRuntime >= safeBrownoutHours ? "HIGH" : backupRuntime >= safeBrownoutHours * 0.65 ? "MEDIUM" : "LOW";
  const wattAppliances = Math.max(3, Math.round(safeEssentialLoad * 4.7));

  return {
    systemKw,
    monthlySavings,
    paybackYears,
    estimatedSystemCost: safeSystemCost,
    financedAmount,
    monthlyPayment,
    totalInterest,
    totalPayment,
    backupRuntime,
    backupConfidence,
    wattAppliances,
    totalDailyUsage: safeDailyUsage * 0.6,
    usageBasedKw,
    billBasedKw,
    roofCapacityKw,
    isRoofLimited: roofCapacityKw < desiredSystemKw,
  };
}

export default function ZEERSolarLandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [monthlyBill, setMonthlyBill] = useState(8500);
  const [dailyUsage, setDailyUsage] = useState(20);
  const [roofArea, setRoofArea] = useState(50);
  const [roofType, setRoofType] = useState("Metal");

  const [systemCost, setSystemCost] = useState(350000);
  const [downPayment, setDownPayment] = useState(20);
  const [loanYears, setLoanYears] = useState(7);
  const [interestRate, setInterestRate] = useState(7.5);

  const [batterySize, setBatterySize] = useState(10);
  const [essentialLoad, setEssentialLoad] = useState(1.5);
  const [brownoutHours, setBrownoutHours] = useState(4);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    monthlyBill: "8500",
    location: "",
    message: "",
  });

  const estimate = useMemo(
    () => calculateSolarEstimate({ monthlyBill, dailyUsage, roofArea, systemCost, downPayment, loanYears, interestRate, batterySize, essentialLoad, brownoutHours }),
    [monthlyBill, dailyUsage, roofArea, systemCost, downPayment, loanYears, interestRate, batterySize, essentialLoad, brownoutHours]
  );

  const peso = (value) => pesoFormatter.format(value);
  const leadMailtoHref = useMemo(() => {
    const subject = encodeURIComponent("ZEER Solar Free Estimate Request");
    const body = encodeURIComponent([
      "Hello Engr. Everard Arbon,",
      "",
      "I would like to request a solar estimate.",
      "",
      `Name: ${leadForm.name || "-"}`,
      `Phone: ${leadForm.phone || "-"}`,
      `Email: ${leadForm.email || "-"}`,
      `Monthly electric bill: ${leadForm.monthlyBill ? peso(Number(leadForm.monthlyBill)) : "-"}`,
      `Location: ${leadForm.location || "-"}`,
      "",
      "Message:",
      leadForm.message || "-",
    ].join("\n"));

    return `mailto:arboneverard1145@gmail.com?subject=${subject}&body=${body}`;
  }, [leadForm]);

  const updateLeadForm = (field, value) => {
    setLeadForm((current) => ({ ...current, [field]: value }));
  };

  const submitLeadForm = (event) => {
    event.preventDefault();
    window.location.href = leadMailtoHref;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <ZEERLogo compact />
          <nav className="hidden items-center gap-9 text-sm font-semibold text-slate-700 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} className={link.href === "#home" ? "border-b-2 border-blue-600 pb-1 text-blue-700" : "hover:text-blue-700"} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a href="#estimate" className="hidden rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:inline-flex">
            Get Free Estimate
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-blue-950 lg:hidden"
          >
            <Icon name={mobileNavOpen ? "close" : "menu"} />
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 text-sm font-bold text-slate-700 sm:grid-cols-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileNavOpen(false)} className="rounded-lg px-3 py-3 hover:bg-blue-50 hover:text-blue-700">
                  {link.label}
                </a>
              ))}
              <a href="#estimate" onClick={() => setMobileNavOpen(false)} className="col-span-2 rounded-lg bg-blue-700 px-3 py-3 text-center text-white hover:bg-blue-800 sm:col-span-3">
                Get Free Estimate
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="home">
        <section className="relative overflow-hidden bg-sky-50">
          <div className="absolute inset-0 hidden lg:block">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(253,186,116,0.38),transparent_26%),linear-gradient(105deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.72)_56%,rgba(255,255,255,0.22)_78%,rgba(255,255,255,0.06)_100%)]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-24">
            <div className="max-w-xl">
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-blue-950 sm:text-6xl lg:text-7xl">
                Smarter Solar. <span className="text-green-600">Stronger</span> Tomorrow.
              </h1>
              <p className="mt-7 text-lg leading-8 text-slate-700">
                <strong>ZEER Solar Solutions</strong> helps you take control of your energy with smart tools, accurate insights, and flexible financing. Build a cleaner, brighter, and more reliable future today.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <HeroMini icon="bolt" title="Lower Bills" text="Save more every month" />
                <HeroMini icon="leaf" title="Clean Energy" text="For a better tomorrow" />
                <HeroMini icon="shield" title="Energy Security" text="Power when you need it" />
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#estimate" className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-700/25 transition hover:bg-blue-800">
                  Get Your Free Estimate <span className="ml-2">→</span>
                </a>
                <a href="#how" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-blue-700 shadow-lg transition hover:border-blue-200 hover:bg-blue-50">
                  How It Works <span className="ml-2">▷</span>
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-[520px]">
              <div className="absolute bottom-3 right-0 hidden rounded-3xl bg-blue-950/95 px-7 py-6 text-white shadow-2xl lg:block">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-3xl font-black">✓</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Trusted by homeowners</p>
                    <p className="text-3xl font-black">2,500+</p>
                    <p className="text-sm text-slate-300">across the Philippines</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-14 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <ServicePoint icon="panel" title="Solar Consultation" text="Review your bill, roof area, and energy goals before recommending a system size." />
              <ServicePoint icon="tools" title="Installation Support" text="Coordinate professional installation with equipment built for local home conditions." />
              <ServicePoint icon="calculator" title="Financing Guidance" text="Compare down payment, loan term, and monthly payment options before committing." />
              <ServicePoint icon="battery" title="Backup Planning" text="Plan solar plus battery capacity around essential loads and expected brownout hours." />
            </div>
          </div>
        </section>

        <section id="tools" className="bg-slate-50 px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-3xl font-black text-blue-950 sm:text-4xl">Powerful Tools. <span className="text-green-600">Smarter Decisions.</span></h2>
              <p className="mt-4 text-slate-600">Use our interactive tools to design your solar system, explore financing, and prepare for any power situation.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <ToolCard color="blue" icon="panel" title="Smart Solar Estimator" subtitle="Get an instant estimate for your solar system.">
                <RangeInput label="Monthly Electric Bill (₱)" value={monthlyBill} min={1000} max={30000} step={500} onChange={setMonthlyBill} display={peso(monthlyBill)} color="blue" />
                <RangeInput label="Average Daily Usage (kWh)" value={dailyUsage} min={5} max={50} step={1} onChange={setDailyUsage} display={`${dailyUsage} kWh`} color="blue" />
                <SelectRow label="Roof Type" value={roofType} options={["Metal", "Concrete", "Tile"]} onChange={setRoofType} />
                <RangeInput label="Available Roof Area" value={roofArea} min={10} max={200} step={5} onChange={setRoofArea} display={`${roofArea} m²`} color="blue" />

                <div className="mt-6 rounded-3xl bg-blue-50 p-6 text-center">
                  <p className="text-sm font-bold text-blue-900">Estimated System</p>
                  <p className="mt-2 text-4xl font-black text-blue-700">{estimate.systemKw.toFixed(1)} kWp</p>
                  {estimate.isRoofLimited && (
                    <p className="mx-auto mt-2 max-w-xs text-xs font-semibold text-orange-600">
                      Limited by available roof area
                    </p>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs text-slate-600">
                    <Metric label="Daily Usage Need" value={`${estimate.usageBasedKw.toFixed(1)} kWp`} />
                    <Metric label="Roof Capacity" value={`${estimate.roofCapacityKw.toFixed(1)} kWp`} />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                    <Metric label="Est. Monthly Savings" value={peso(estimate.monthlySavings)} />
                    <Metric label="Est. Payback Period" value={`${estimate.paybackYears.toFixed(1)} Years`} />
                    <Metric label="Est. System Cost" value={peso(estimate.estimatedSystemCost)} />
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">*System size now considers electric bill, daily usage, and available roof capacity. Final proposal may vary.</p>
              </ToolCard>

              <ToolCard color="orange" icon="battery" title="Brownout Simulator" subtitle="See how your solar + battery keeps you going.">
                <RangeInput label="Select Battery Size" value={batterySize} min={5} max={20} step={1} onChange={setBatterySize} display={`${batterySize} kWh`} color="orange" />
                <RangeInput label="Essential Load (kW)" value={essentialLoad} min={0.5} max={5} step={0.1} onChange={setEssentialLoad} display={`${essentialLoad.toFixed(1)} kW`} color="orange" />
                <div className="mb-5">
                  <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-700">
                    <span>Brownout Duration</span>
                    <span>{brownoutHours} Hours</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 4, 6, 8].map((hour) => (
                      <button key={hour} onClick={() => setBrownoutHours(hour)} className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${brownoutHours === hour ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"}`}>
                        {hour} Hr
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-orange-50 p-6 text-center">
                  <p className="text-sm font-bold text-orange-600">You Can Stay Powered For</p>
                  <p className="mt-2 text-4xl font-black text-orange-600">{estimate.backupRuntime.toFixed(1)} Hours</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                    <Metric label="Watt Appliances" value={estimate.wattAppliances} />
                    <Metric label="Total Daily Usage" value={`${estimate.totalDailyUsage.toFixed(1)} kWh`} />
                    <Metric label="Backup Confidence" value={estimate.backupConfidence} accent={estimate.backupConfidence === "HIGH" ? "text-green-600" : estimate.backupConfidence === "MEDIUM" ? "text-orange-600" : "text-red-600"} />
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">*Simulation based on ideal conditions.</p>
              </ToolCard>

              <ToolCard color="green" icon="calculator" title="Financing Calculator" subtitle="Find the best payment plan that fits your budget.">
                <RangeInput label="System Cost" value={systemCost} min={100000} max={1000000} step={25000} onChange={setSystemCost} display={peso(systemCost)} color="green" />
                <RangeInput label="Down Payment" value={downPayment} min={0} max={50} step={5} onChange={setDownPayment} display={`${downPayment}% (${peso(systemCost * downPayment / 100)})`} color="green" />
                <div className="mb-5">
                  <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-700">
                    <span>Loan Term</span>
                    <span>{loanYears} Years</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[3, 5, 7, 10, 15].map((year) => (
                      <button key={year} onClick={() => setLoanYears(year)} className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${loanYears === year ? "border-green-600 bg-green-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-green-300"}`}>
                        {year} Yrs
                      </button>
                    ))}
                  </div>
                </div>
                <RangeInput label="Interest Rate (Annual)" value={interestRate} min={0} max={15} step={0.5} onChange={setInterestRate} display={`${interestRate}%`} color="green" />

                <div className="mt-6 rounded-3xl bg-green-50 p-6 text-center">
                  <p className="text-sm font-bold text-green-800">Estimated Monthly Payment</p>
                  <p className="mt-2 text-4xl font-black text-green-700">{peso(estimate.monthlyPayment)}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs text-slate-600">
                    <Metric label="Total Interest" value={peso(estimate.totalInterest)} />
                    <Metric label="Total Payment" value={peso(estimate.totalPayment)} />
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">*Based on reducing balance. Subject to bank approval.</p>
              </ToolCard>
            </div>
          </div>
        </section>

        <section id="estimate" className="bg-slate-50 px-6 py-16 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-green-600">Free Estimate</p>
              <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">Request a solar assessment.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Share your monthly bill, location, and project notes. The form opens your email client with the details ready to send, so there is no account or backend required.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <EstimateBenefit icon="bolt" title="Bill-focused sizing" text="Start with your current electricity spend." />
                <EstimateBenefit icon="shield" title="Practical backup advice" text="Match batteries to essential loads." />
                <EstimateBenefit icon="award" title="Clear proposal path" text="Move from estimate to site validation." />
                <EstimateBenefit icon="mail" title="Direct contact" text="Send details to the ZEER contact email." />
              </div>
            </div>

            <form onSubmit={submitLeadForm} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <LeadField label="Full Name" value={leadForm.name} onChange={(value) => updateLeadForm("name", value)} required />
                <LeadField label="Phone Number" value={leadForm.phone} onChange={(value) => updateLeadForm("phone", value)} type="tel" required />
                <LeadField label="Email Address" value={leadForm.email} onChange={(value) => updateLeadForm("email", value)} type="email" />
                <LeadField label="Monthly Electric Bill" value={leadForm.monthlyBill} onChange={(value) => updateLeadForm("monthlyBill", value)} type="number" min="0" />
                <LeadField label="Location" value={leadForm.location} onChange={(value) => updateLeadForm("location", value)} className="sm:col-span-2" placeholder="City or barangay" />
                <LeadTextArea label="Project Notes" value={leadForm.message} onChange={(value) => updateLeadForm("message", value)} className="sm:col-span-2" placeholder="Tell us about your roof, timeline, backup needs, or questions." />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800">
                  Send Estimate Request <span className="ml-2">→</span>
                </button>
                <a href={leadMailtoHref} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-4 text-base font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50">
                  Open Email Draft
                </a>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                This static form uses your email app to send the request to arboneverard1145@gmail.com.
              </p>
            </form>
          </div>
        </section>

        <section id="how" className="bg-white px-6 py-10 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 md:grid-cols-4">
            <TrustBlock icon="award" title="Quality You Can Trust" text="We use premium solar equipment built to last." />
            <TrustBlock icon="tools" title="Expert Installation" text="Professional engineers and technicians at your service." />
            <TrustBlock icon="shield" title="After-Sales Support" text="We're with you every step of the way." />
            <TrustBlock icon="earth" title="Sustainable Future" text="Together, we create a cleaner, greener Philippines." />
          </div>
        </section>

        <section id="about" className="relative overflow-hidden bg-blue-950 px-6 py-20 text-white lg:px-10">
          <div className="absolute inset-x-0 top-0 h-10 rounded-b-[100%] bg-white" />
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-black">Solar decisions should be simple.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
              ZEER Solar Solutions combines consultation, estimation tools, financing guidance, and energy security planning so customers can move to solar with confidence.
            </p>
            <a href="#estimate" className="mt-8 inline-flex rounded-xl bg-green-500 px-8 py-4 font-bold text-white shadow-xl shadow-green-500/20 transition hover:bg-green-600">
              Request a Free Estimate
            </a>
          </div>
        </section>

        <section id="contact" className="bg-white px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-black text-blue-950 sm:text-4xl">Get In Touch</h2>
              <p className="mt-4 text-slate-600">Have questions? We'd love to hear from you.</p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Icon name="phone" />
                </div>
                <h3 className="mt-4 font-bold text-blue-950">Phone</h3>
                <a className="mt-2 block text-slate-600 hover:text-blue-700" href="tel:+639691068846">+63 969 106 8846</a>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Icon name="mail" />
                </div>
                <h3 className="mt-4 font-bold text-blue-950">Email</h3>
                <p className="mt-2 font-semibold text-slate-700">Mr. Everard Arbon</p>
                <a className="mt-1 block text-slate-600 hover:text-blue-700" href="mailto:arboneverard1145@gmail.com">
                  arboneverard1145@gmail.com
                </a>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Icon name="map" />
                </div>
                <h3 className="mt-4 font-bold text-blue-950">Location</h3>
                <p className="mt-2 text-slate-600">Talisay, Cebu City</p>
                <p className="mt-2 text-slate-600">Philippines, 6045</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ServicePoint({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Icon name={icon} />
      </div>
      <h3 className="mt-4 font-black text-blue-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function EstimateBenefit({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-md">
        <Icon name={icon} />
      </div>
      <div>
        <p className="font-black text-blue-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function LeadField({ label, value, onChange, type = "text", required = false, className = "", placeholder = "", min }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function LeadTextArea({ label, value, onChange, className = "", placeholder = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        rows={5}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function ZEERLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/zeer-logo.png" 
        alt="ZEER Solar Solutions" 
        className={compact ? "h-14 w-auto" : "h-20 w-auto"} 
      />
    </div>
  );
}

function ToolCard({ color, icon, title, subtitle, children }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="mb-6 flex items-start gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${colorMap[color]}`}>
          <Icon name={icon} size="lg" />
        </div>
        <div>
          <h3 className={`text-xl font-black ${color === "blue" ? "text-blue-700" : color === "green" ? "text-green-700" : "text-orange-600"}`}>{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function RangeInput({ label, value, min, max, step, onChange, display, color }) {
  const accent = color === "blue" ? "accent-blue-600" : color === "green" ? "accent-green-600" : "accent-orange-500";

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-slate-700">
        <span>{label}</span>
        <span className="text-blue-950">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className={`w-full ${accent}`} />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4 text-sm font-bold text-slate-700">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-blue-950 outline-none focus:border-blue-400">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function Metric({ label, value, accent = "text-blue-950" }) {
  return (
    <div className="border-r border-slate-200 last:border-r-0">
      <p>{label}</p>
      <p className={`mt-2 text-lg font-black ${accent}`}>{value}</p>
    </div>
  );
}

function HeroMini({ icon, title, text }) {
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

function TrustBlock({ icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl p-4">
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

function Icon({ name, size = "md" }) {
  const sizeClass = size === "lg" ? "h-8 w-8" : "h-5 w-5";
  const common = `${sizeClass}`;

  const icons = {
    bolt: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>,
    leaf: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M20 3C12 4 5 9 4 20c9-1 16-8 16-17Z" /><path d="M4 20c4-6 8-9 14-13" /></svg>,
    shield: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>,
    panel: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M4 5h16l-2 14H2L4 5Z" /><path d="M6 9h13M5 13h13M9 5 7 19M14 5l-2 14" /></svg>,
    calculator: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>,
    battery: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 11v2M10 9l-2 4h3l-1 3 4-5h-3l1-2Z" /></svg>,
    award: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" /></svg>,
    tools: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-3 3-3-3 3-3Z" /></svg>,
    earth: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>,
    phone: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>,
    mail: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
    map: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
    menu: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
    close: <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  };

  return icons[name] || icons.bolt;
}
