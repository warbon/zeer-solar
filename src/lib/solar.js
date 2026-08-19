/**
 * Solar sizing, savings, financing and backup math for the ZEER estimator.
 *
 * All figures are planning estimates for Cebu, Philippines. The constants below
 * are the assumptions behind every number shown on the site -- change them here
 * rather than inline so the whole page stays consistent.
 */

/**
 * Average peak sun hours per day for Cebu. Cebu measures among the highest in
 * the country (~5.2); 5.0 keeps a small margin. Combined with SYSTEM_DERATE
 * this yields ~3.9 kWh/kWp/day, in line with published PVOUT for the region.
 */
export const PEAK_SUN_HOURS = 5.0;

/** Combined losses: inverter, wiring, soiling, temperature. */
export const SYSTEM_DERATE = 0.78;

/**
 * Retail grid tariff in PHP per kWh -- the rate a self-consumed kWh avoids.
 * Visayan Electric residential rates through 2026 ran 11.72 (Jan) to 14.90
 * (Jul), averaging 12.99. Update as rates move; they have trended upward.
 */
export const TARIFF_PHP_PER_KWH = 13.0;

/**
 * What the utility credits for an exported kWh under ERC net metering: the
 * blended generation charge only, not the full retail rate. Typically PHP 5-6.
 * This is why savings are far lower than "production x retail tariff".
 */
export const EXPORT_CREDIT_PHP_PER_KWH = 5.5;

/**
 * Share of production consumed on-site as it is generated, for a household
 * without storage. Daytime load in a typical home is low, so most output is
 * exported. Raise this toward 0.7 for a battery system or daytime-heavy load.
 */
export const SELF_CONSUMPTION_FRACTION = 0.4;

/** Installed cost per watt-peak in PHP, before roof-type adjustment. */
export const COST_PER_WP = 62;

/** Roof area in m² needed per kWp of panels. */
export const M2_PER_KWP = 8;

/** Usable fraction of a battery's nameplate capacity (depth of discharge). */
export const BATTERY_DEPTH_OF_DISCHARGE = 0.9;

/** Inverter efficiency when discharging the battery. */
export const INVERTER_EFFICIENCY = 0.92;

/** Largest residential system we quote, in kWp. */
export const MAX_SYSTEM_KWP = 20;

/** Smallest system worth installing, in kWp. */
export const MIN_SYSTEM_KWP = 1.5;

/**
 * Roof-type cost multipliers. Metal is the baseline; tile needs more labour and
 * specialised hooks, concrete needs ballast or penetrations.
 */
export const ROOF_TYPE_FACTORS = {
  Metal: 1,
  Concrete: 1.08,
  Tile: 1.15,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Monthly kWh a given array produces.
 */
export function monthlyProductionKwh(systemKw) {
  return systemKw * PEAK_SUN_HOURS * SYSTEM_DERATE * 30;
}

/**
 * Installed price for an array of this size on this roof type.
 */
export function systemCostFor(systemKw, roofType = "Metal") {
  const factor = ROOF_TYPE_FACTORS[roofType] ?? ROOF_TYPE_FACTORS.Metal;
  return systemKw * 1000 * COST_PER_WP * factor;
}

/**
 * Level monthly payment on a reducing-balance loan.
 */
export function amortizedPayment(principal, annualRatePercent, years) {
  const termMonths = Math.max(1, years) * 12;
  const monthlyRate = Math.max(0, annualRatePercent) / 100 / 12;

  if (monthlyRate === 0) return principal / termMonths;

  const growth = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * growth) / (growth - 1);
}

/**
 * Hours a battery can carry a given essential load, after DoD and inverter losses.
 */
export function backupRuntimeHours(batteryKwh, essentialLoadKw) {
  const usable = batteryKwh * BATTERY_DEPTH_OF_DISCHARGE * INVERTER_EFFICIENCY;
  return usable / essentialLoadKw;
}

/**
 * The single source of truth for every number rendered by the estimator,
 * brownout simulator and financing calculator.
 */
export function calculateSolarEstimate({
  monthlyBill,
  dailyUsage,
  roofArea,
  roofType = "Metal",
  downPayment,
  loanYears,
  interestRate,
  batterySize,
  essentialLoad,
  brownoutHours,
}) {
  const safeMonthlyBill = Math.max(0, toNumber(monthlyBill, 0));
  const safeDailyUsage = Math.max(1, toNumber(dailyUsage, 1));
  const safeRoofArea = Math.max(10, toNumber(roofArea, 10));
  const safeDownPayment = clamp(toNumber(downPayment, 0), 0, 50);
  const safeLoanYears = Math.max(1, toNumber(loanYears, 1));
  const safeInterestRate = Math.max(0, toNumber(interestRate, 0));
  const safeBatterySize = Math.max(1, toNumber(batterySize, 1));
  const safeEssentialLoad = Math.max(0.5, toNumber(essentialLoad, 0.5));
  const safeBrownoutHours = Math.max(1, toNumber(brownoutHours, 1));

  // Three independent reads on how big the array should be.
  const billBasedKw = safeMonthlyBill / TARIFF_PHP_PER_KWH / 30 / (PEAK_SUN_HOURS * SYSTEM_DERATE);
  const usageBasedKw = safeDailyUsage / (PEAK_SUN_HOURS * SYSTEM_DERATE);
  const roofCapacityKw = safeRoofArea / M2_PER_KWP;

  const desiredSystemKw = Math.max(MIN_SYSTEM_KWP, billBasedKw, usageBasedKw);
  const systemKw = clamp(
    Math.min(roofCapacityKw, desiredSystemKw),
    Math.min(MIN_SYSTEM_KWP, roofCapacityKw),
    MAX_SYSTEM_KWP
  );
  const isRoofLimited = roofCapacityKw < desiredSystemKw;

  // Every kWh produced is either used on site or exported, and the two are
  // worth very different amounts. Self-consumed energy avoids a retail kWh;
  // exported energy earns only the blended generation charge. Modelling the
  // split is what separates a defensible estimate from "production x retail".
  const productionKwh = monthlyProductionKwh(systemKw);
  const consumptionKwh = safeDailyUsage * 30;

  // Cannot self-consume more than the household actually uses.
  const selfConsumedKwh = Math.min(productionKwh * SELF_CONSUMPTION_FRACTION, consumptionKwh);
  const exportedKwh = Math.max(0, productionKwh - selfConsumedKwh);

  const grossSavings =
    selfConsumedKwh * TARIFF_PHP_PER_KWH + exportedKwh * EXPORT_CREDIT_PHP_PER_KWH;
  // A bill cannot go below zero; surplus credits roll over but are forfeited
  // at year end, so we do not count them as savings.
  const monthlySavings = Math.min(grossSavings, safeMonthlyBill);
  const offsetPercent = safeMonthlyBill > 0 ? (monthlySavings / safeMonthlyBill) * 100 : 0;

  const estimatedSystemCost = systemCostFor(systemKw, roofType);
  const paybackYears = monthlySavings > 0 ? estimatedSystemCost / (monthlySavings * 12) : null;

  // Financing runs on the derived system cost, so the two cards agree.
  const downPaymentAmount = estimatedSystemCost * (safeDownPayment / 100);
  const financedAmount = estimatedSystemCost - downPaymentAmount;
  const monthlyPayment = amortizedPayment(financedAmount, safeInterestRate, safeLoanYears);
  const totalPayment = monthlyPayment * safeLoanYears * 12 + downPaymentAmount;
  const totalInterest = Math.max(0, totalPayment - estimatedSystemCost);
  const netMonthlyCost = monthlyPayment - monthlySavings;

  const backupRuntime = backupRuntimeHours(safeBatterySize, safeEssentialLoad);
  const backupConfidence =
    backupRuntime >= safeBrownoutHours
      ? "HIGH"
      : backupRuntime >= safeBrownoutHours * 0.65
        ? "MEDIUM"
        : "LOW";
  const usableBatteryKwh = safeBatterySize * BATTERY_DEPTH_OF_DISCHARGE * INVERTER_EFFICIENCY;

  return {
    systemKw,
    billBasedKw,
    usageBasedKw,
    roofCapacityKw,
    isRoofLimited,
    panelCount: Math.ceil((systemKw * 1000) / 615),

    monthlyProductionKwh: productionKwh,
    monthlyConsumptionKwh: consumptionKwh,
    selfConsumedKwh,
    exportedKwh,
    monthlySavings,
    offsetPercent,
    paybackYears,

    estimatedSystemCost,
    downPaymentAmount,
    financedAmount,
    monthlyPayment,
    totalInterest,
    totalPayment,
    netMonthlyCost,

    backupRuntime,
    backupConfidence,
    usableBatteryKwh,
  };
}
