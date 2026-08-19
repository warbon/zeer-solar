import { Metric, OptionRow, RangeInput, SelectRow, ToolCard } from "./ui.jsx";
import AnimatedNumber from "./AnimatedNumber.jsx";

const LOAN_TERMS = [3, 5, 7, 10, 15];
const BROWNOUT_DURATIONS = [1, 2, 4, 6, 8];

export default function Tools({ inputs, setters, estimate, peso, onEngage }) {
  const {
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
  } = inputs;

  // Wrap each setter so the first interaction with a tool reports to analytics.
  const track = (tool, setter) => (value) => {
    onEngage(tool);
    setter(value);
  };

  return (
    <section id="tools" className="bg-slate-50 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black text-blue-950 sm:text-4xl">
            Powerful Tools. <span className="text-green-600">Smarter Decisions.</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Use our interactive tools to design your solar system, explore financing, and prepare
            for any power situation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ToolCard
            color="blue"
            icon="panel"
            title="Smart Solar Estimator"
            subtitle="Get an instant estimate for your solar system."
          >
            <RangeInput
              label="Monthly Electric Bill"
              value={monthlyBill}
              min={1000}
              max={30000}
              step={500}
              onChange={track("estimator", setters.setMonthlyBill)}
              display={peso(monthlyBill)}
              unitHint="per month"
              color="blue"
            />
            <RangeInput
              label="Average Daily Usage"
              value={dailyUsage}
              min={5}
              max={50}
              step={1}
              onChange={track("estimator", setters.setDailyUsage)}
              display={`${dailyUsage} kWh`}
              unitHint="per day"
              color="blue"
            />
            <SelectRow
              label="Roof Type"
              value={roofType}
              options={["Metal", "Concrete", "Tile"]}
              onChange={track("estimator", setters.setRoofType)}
            />
            <RangeInput
              label="Available Roof Area"
              value={roofArea}
              min={10}
              max={200}
              step={5}
              onChange={track("estimator", setters.setRoofArea)}
              display={`${roofArea} m²`}
              unitHint="square metres"
              color="blue"
            />

            <div className="mt-6 rounded-3xl bg-blue-50 p-6 text-center">
              <p className="text-sm font-bold text-blue-900">Estimated System</p>
              <p className="mt-2 text-4xl font-black text-blue-700">
                <AnimatedNumber value={estimate.systemKw} formatter={(n) => `${n.toFixed(1)} kWp`} />
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                about {estimate.panelCount} panels
              </p>
              {estimate.isRoofLimited && (
                <p className="mx-auto mt-2 max-w-xs text-xs font-semibold text-orange-600">
                  Limited by available roof area — savings below reflect this smaller system.
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs text-slate-600">
                <Metric label="Monthly Production" value={`${Math.round(estimate.monthlyProductionKwh)} kWh`} />
                <Metric label="Roof Capacity" value={`${estimate.roofCapacityKw.toFixed(1)} kWp`} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                <Metric label="Est. Monthly Savings" value={peso(estimate.monthlySavings)} />
                <Metric
                  label="Est. Payback Period"
                  value={estimate.paybackYears ? `${estimate.paybackYears.toFixed(1)} Years` : "—"}
                />
                <Metric label="Est. System Cost" value={peso(estimate.estimatedSystemCost)} />
              </div>
              <p className="mt-4 text-xs font-semibold text-blue-900">
                Covers about {Math.round(estimate.offsetPercent)}% of your current bill
              </p>
              <div className="mt-4 border-t border-blue-100 pt-3 text-left text-xs text-slate-600">
                <p className="font-bold text-blue-900">How the savings are made up</p>
                <p className="mt-1 flex justify-between">
                  <span>Used at home (retail rate)</span>
                  <span className="font-semibold">{Math.round(estimate.selfConsumedKwh)} kWh</span>
                </p>
                <p className="mt-1 flex justify-between">
                  <span>Exported (net metering credit)</span>
                  <span className="font-semibold">{Math.round(estimate.exportedKwh)} kWh</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              *Sized from your bill, daily usage, and roof capacity. Assumes {"₱"}13.00/kWh retail
              and {"₱"}5.50/kWh for exported energy under ERC net metering, with about 40% of
              output used as it is generated. A battery raises that share. Final proposal follows a
              site visit.
            </p>
          </ToolCard>

          <ToolCard
            color="orange"
            icon="battery"
            title="Brownout Simulator"
            subtitle="See how your solar + battery keeps you going."
          >
            <RangeInput
              label="Battery Size"
              value={batterySize}
              min={5}
              max={20}
              step={1}
              onChange={track("brownout", setters.setBatterySize)}
              display={`${batterySize} kWh`}
              color="orange"
            />
            <RangeInput
              label="Essential Load"
              value={essentialLoad}
              min={0.5}
              max={5}
              step={0.1}
              onChange={track("brownout", setters.setEssentialLoad)}
              display={`${essentialLoad.toFixed(1)} kW`}
              color="orange"
            />
            <OptionRow
              label="Brownout Duration"
              value={brownoutHours}
              options={BROWNOUT_DURATIONS}
              onChange={track("brownout", setters.setBrownoutHours)}
              format={(hour) => `${hour} Hr`}
              color="orange"
            />

            <div className="mt-6 rounded-3xl bg-orange-50 p-6 text-center">
              <p className="text-sm font-bold text-orange-600">You Can Stay Powered For</p>
              <p className="mt-2 text-4xl font-black text-orange-600">
                <AnimatedNumber value={estimate.backupRuntime} formatter={(n) => `${n.toFixed(1)} Hours`} />
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                <Metric label="Usable Battery" value={`${estimate.usableBatteryKwh.toFixed(1)} kWh`} />
                <Metric label="Essential Load" value={`${essentialLoad.toFixed(1)} kW`} />
                <Metric
                  label="Backup Confidence"
                  value={estimate.backupConfidence}
                  accent={
                    estimate.backupConfidence === "HIGH"
                      ? "text-green-600"
                      : estimate.backupConfidence === "MEDIUM"
                        ? "text-orange-600"
                        : "text-red-600"
                  }
                />
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              *Usable capacity accounts for 90% depth of discharge and 92% inverter efficiency.
            </p>
          </ToolCard>

          <ToolCard
            color="green"
            icon="calculator"
            title="Financing Calculator"
            subtitle="Find the best payment plan that fits your budget."
          >
            <div className="mb-5 rounded-2xl bg-green-50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3 font-bold text-green-900">
                <span>System Cost</span>
                <span>{peso(estimate.estimatedSystemCost)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                From your {estimate.systemKw.toFixed(1)} kWp system on a {roofType.toLowerCase()} roof.
                Adjust the estimator to change this.
              </p>
            </div>
            <RangeInput
              label="Down Payment"
              value={downPayment}
              min={0}
              max={50}
              step={5}
              onChange={track("financing", setters.setDownPayment)}
              display={`${downPayment}% (${peso(estimate.downPaymentAmount)})`}
              color="green"
            />
            <OptionRow
              label="Loan Term"
              value={loanYears}
              options={LOAN_TERMS}
              onChange={track("financing", setters.setLoanYears)}
              format={(year) => `${year} Yr`}
              color="green"
            />
            <RangeInput
              label="Interest Rate (Annual)"
              value={interestRate}
              min={0}
              max={15}
              step={0.5}
              onChange={track("financing", setters.setInterestRate)}
              display={`${interestRate}%`}
              color="green"
            />

            <div className="mt-6 rounded-3xl bg-green-50 p-6 text-center">
              <p className="text-sm font-bold text-green-800">Estimated Monthly Payment</p>
              <p className="mt-2 text-4xl font-black text-green-700">
                <AnimatedNumber value={estimate.monthlyPayment} formatter={peso} />
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                minus {peso(estimate.monthlySavings)} saved ={" "}
                <span className={estimate.netMonthlyCost <= 0 ? "text-green-700" : "text-blue-950"}>
                  {estimate.netMonthlyCost <= 0
                    ? `${peso(Math.abs(estimate.netMonthlyCost))} ahead`
                    : `${peso(estimate.netMonthlyCost)} net`}
                </span>{" "}
                per month
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs text-slate-600">
                <Metric label="Total Interest" value={peso(estimate.totalInterest)} />
                <Metric label="Total Payment" value={peso(estimate.totalPayment)} />
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              *Based on reducing balance. Subject to bank approval.
            </p>
          </ToolCard>
        </div>
      </div>
    </section>
  );
}
