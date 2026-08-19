import { describe, expect, it } from "vitest";
import {
  BATTERY_DEPTH_OF_DISCHARGE,
  EXPORT_CREDIT_PHP_PER_KWH,
  INVERTER_EFFICIENCY,
  MAX_SYSTEM_KWP,
  ROOF_TYPE_FACTORS,
  TARIFF_PHP_PER_KWH,
  amortizedPayment,
  backupRuntimeHours,
  calculateSolarEstimate,
  monthlyProductionKwh,
  systemCostFor,
} from "./solar.js";

const baseInput = {
  monthlyBill: 8500,
  dailyUsage: 20,
  roofArea: 50,
  roofType: "Metal",
  downPayment: 20,
  loanYears: 7,
  interestRate: 7.5,
  batterySize: 10,
  essentialLoad: 1.5,
  brownoutHours: 4,
};

const estimateWith = (overrides) => calculateSolarEstimate({ ...baseInput, ...overrides });

describe("system sizing", () => {
  it("caps the array at what the roof can physically hold", () => {
    const tiny = estimateWith({ roofArea: 10, monthlyBill: 30000, dailyUsage: 50 });

    expect(tiny.roofCapacityKw).toBeCloseTo(1.25, 5);
    expect(tiny.systemKw).toBeCloseTo(1.25, 5);
    expect(tiny.isRoofLimited).toBe(true);
  });

  it("does not exceed the maximum residential system size", () => {
    const huge = estimateWith({ roofArea: 200, monthlyBill: 30000, dailyUsage: 50 });

    expect(huge.systemKw).toBeLessThanOrEqual(MAX_SYSTEM_KWP);
  });

  it("flags a roof as unlimited when it comfortably fits the demand", () => {
    expect(estimateWith({ roofArea: 200 }).isRoofLimited).toBe(false);
  });
});

describe("savings", () => {
  it("scales with the array actually installed, not the bill alone", () => {
    const bigRoof = estimateWith({ roofArea: 200 });
    const tinyRoof = estimateWith({ roofArea: 10 });

    // Same bill, drastically different roof -> savings must differ.
    expect(tinyRoof.monthlySavings).toBeLessThan(bigRoof.monthlySavings / 2);
  });

  it("never promises more savings than the whole bill", () => {
    const overbuilt = estimateWith({ roofArea: 200, monthlyBill: 1000, dailyUsage: 50 });

    expect(overbuilt.monthlySavings).toBeLessThanOrEqual(1000);
    expect(overbuilt.offsetPercent).toBeLessThanOrEqual(100);
  });

  it("never self-consumes more energy than the household uses", () => {
    const lowUsage = estimateWith({ roofArea: 200, dailyUsage: 5, monthlyBill: 30000 });

    expect(lowUsage.selfConsumedKwh).toBeLessThanOrEqual(lowUsage.monthlyConsumptionKwh + 1e-6);
  });

  it("splits all production between self-consumption and export", () => {
    const result = estimateWith({});

    expect(result.selfConsumedKwh + result.exportedKwh).toBeCloseTo(
      result.monthlyProductionKwh,
      5
    );
  });

  it("values self-consumed energy at retail and exports at the generation charge", () => {
    const result = estimateWith({ roofArea: 50 });
    const expected =
      result.selfConsumedKwh * TARIFF_PHP_PER_KWH +
      result.exportedKwh * EXPORT_CREDIT_PHP_PER_KWH;

    expect(result.monthlySavings).toBeCloseTo(Math.min(expected, baseInput.monthlyBill), 5);
  });

  it("credits exports below the retail rate, so savings trail naive estimates", () => {
    const result = estimateWith({});
    const naive = Math.min(result.monthlyProductionKwh, result.monthlyConsumptionKwh) * TARIFF_PHP_PER_KWH;

    expect(result.monthlySavings).toBeLessThan(naive);
  });

  it("reports no payback when there is nothing to save", () => {
    expect(estimateWith({ monthlyBill: 0 }).paybackYears).toBeNull();
  });

  it("gives a payback period in a believable range for a typical home", () => {
    const { paybackYears } = estimateWith({});

    expect(paybackYears).toBeGreaterThan(3);
    expect(paybackYears).toBeLessThan(15);
  });
});

describe("cost and financing", () => {
  it("derives system cost from array size so the two cards agree", () => {
    const result = estimateWith({});

    expect(result.estimatedSystemCost).toBeCloseTo(
      systemCostFor(result.systemKw, "Metal"),
      5
    );
  });

  it("charges more for harder roof types", () => {
    const metal = estimateWith({ roofType: "Metal" }).estimatedSystemCost;
    const tile = estimateWith({ roofType: "Tile" }).estimatedSystemCost;

    expect(tile).toBeGreaterThan(metal);
    expect(tile / metal).toBeCloseTo(ROOF_TYPE_FACTORS.Tile, 5);
  });

  it("falls back to the metal multiplier for an unknown roof type", () => {
    expect(systemCostFor(5, "Thatch")).toBeCloseTo(systemCostFor(5, "Metal"), 5);
  });

  it("splits the cost into down payment and financed amount", () => {
    const result = estimateWith({ downPayment: 20 });

    expect(result.downPaymentAmount + result.financedAmount).toBeCloseTo(
      result.estimatedSystemCost,
      5
    );
  });

  it("charges no interest at a zero rate", () => {
    const result = estimateWith({ interestRate: 0 });

    expect(result.totalInterest).toBeCloseTo(0, 5);
    expect(result.monthlyPayment).toBeCloseTo(result.financedAmount / (7 * 12), 5);
  });

  it("charges more total interest over a longer term", () => {
    const short = estimateWith({ loanYears: 3 }).totalInterest;
    const long = estimateWith({ loanYears: 15 }).totalInterest;

    expect(long).toBeGreaterThan(short);
  });

  it("amortizes a known loan correctly", () => {
    // 1,000,000 at 12% over 10 years -> ~14,347.09/month
    expect(amortizedPayment(1_000_000, 12, 10)).toBeCloseTo(14347.09, 1);
  });
});

describe("backup runtime", () => {
  it("accounts for depth of discharge and inverter losses", () => {
    const naive = 10 / 1.5;

    expect(backupRuntimeHours(10, 1.5)).toBeLessThan(naive);
    expect(backupRuntimeHours(10, 1.5)).toBeCloseTo(
      (10 * BATTERY_DEPTH_OF_DISCHARGE * INVERTER_EFFICIENCY) / 1.5,
      5
    );
  });

  it("rates confidence against the expected brownout length", () => {
    expect(estimateWith({ batterySize: 20, essentialLoad: 1, brownoutHours: 4 }).backupConfidence).toBe("HIGH");
    expect(estimateWith({ batterySize: 5, essentialLoad: 5, brownoutHours: 8 }).backupConfidence).toBe("LOW");
  });
});

describe("input hardening", () => {
  it("survives empty strings, nulls and NaN without producing NaN", () => {
    const result = calculateSolarEstimate({
      monthlyBill: "",
      dailyUsage: null,
      roofArea: undefined,
      roofType: undefined,
      downPayment: Number.NaN,
      loanYears: "abc",
      interestRate: null,
      batterySize: "",
      essentialLoad: undefined,
      brownoutHours: null,
    });

    for (const [key, value] of Object.entries(result)) {
      if (typeof value === "number") {
        expect(Number.isFinite(value), `${key} should be finite`).toBe(true);
      }
    }
  });

  it("clamps a down payment above the allowed maximum", () => {
    const result = estimateWith({ downPayment: 500 });

    expect(result.downPaymentAmount).toBeCloseTo(result.estimatedSystemCost * 0.5, 5);
  });

  it("keeps production consistent with the reported array size", () => {
    const result = estimateWith({});

    expect(result.monthlyProductionKwh).toBeCloseTo(monthlyProductionKwh(result.systemKw), 5);
  });
});
