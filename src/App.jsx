import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Tools from "./components/Tools.jsx";
import LeadSection from "./components/LeadSection.jsx";
import Footer from "./components/Footer.jsx";
import { About, Contact, Gallery, HowItWorks, Services, Testimonials } from "./components/Sections.jsx";
import { calculateSolarEstimate } from "./lib/solar.js";
import { createFirstTouchTracker, initAnalytics } from "./lib/analytics.js";
import { useLandingAnimations } from "./hooks/useLandingAnimations.js";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default function ZEERSolarLandingPage() {
  const pageRef = useRef(null);
  const [monthlyBill, setMonthlyBill] = useState(8500);
  const [dailyUsage, setDailyUsage] = useState(20);
  const [roofArea, setRoofArea] = useState(50);
  const [roofType, setRoofType] = useState("Metal");

  const [downPayment, setDownPayment] = useState(20);
  const [loanYears, setLoanYears] = useState(7);
  const [interestRate, setInterestRate] = useState(7.5);

  const [batterySize, setBatterySize] = useState(10);
  const [essentialLoad, setEssentialLoad] = useState(1.5);
  const [brownoutHours, setBrownoutHours] = useState(4);

  useEffect(() => {
    initAnalytics();
  }, []);

  const estimate = useMemo(
    () =>
      calculateSolarEstimate({
        monthlyBill,
        dailyUsage,
        roofArea,
        roofType,
        downPayment,
        loanYears,
        interestRate,
        batterySize,
        essentialLoad,
        brownoutHours,
      }),
    [
      monthlyBill,
      dailyUsage,
      roofArea,
      roofType,
      downPayment,
      loanYears,
      interestRate,
      batterySize,
      essentialLoad,
      brownoutHours,
    ]
  );

  const peso = useCallback((value) => pesoFormatter.format(value), []);

  // One tracker for the session so each tool reports only its first touch.
  const trackFirstTouch = useMemo(() => createFirstTouchTracker(), []);

  useLandingAnimations(pageRef);

  return (
    <div ref={pageRef} className="min-h-screen bg-white font-sans text-slate-900">
      <a
        href="#tools"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-blue-700 focus:px-4 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to solar tools
      </a>

      <Header />

      <main id="home">
        <Hero />
        <Services />
        <Tools
          inputs={{
            monthlyBill,
            dailyUsage,
            roofArea,
            roofType,
            downPayment,
            loanYears,
            interestRate,
            batterySize,
            essentialLoad,
            brownoutHours,
          }}
          setters={{
            setMonthlyBill,
            setDailyUsage,
            setRoofArea,
            setRoofType,
            setDownPayment,
            setLoanYears,
            setInterestRate,
            setBatterySize,
            setEssentialLoad,
            setBrownoutHours,
          }}
          estimate={estimate}
          peso={peso}
          onEngage={trackFirstTouch}
        />
        <HowItWorks />
        <Gallery />
        <Testimonials />
        <About />
        <LeadSection peso={peso} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
