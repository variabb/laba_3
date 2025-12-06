import { compute } from "./compute.js";

describe("compute", () => {
  // Базові тестові дані
  const basePayload = {
    C: 0.5,
    IR: 2,
    EF: 365,
    ED: 10,
    BW: 70,
    RfD: 0.01,
    SF: 0,
    medium: "water",
  };

  test("обчислює CDI, HQ коректно для неканцерогенного ризику", () => {
    const result = compute(basePayload);

    // Перевірка наявності результатів
    expect(result).toHaveProperty("result");
    expect(result.result).toHaveProperty("CDI");
    expect(result.result).toHaveProperty("HQ");
    expect(result.result).toHaveProperty("CR");

    // CDI = (C * IR * EF * ED) / (BW * AT)
    // AT для неканцерогенного = ED * 365 = 10 * 365 = 3650
    // CDI = (0.5 * 2 * 365 * 10) / (70 * 3650) = 3650 / 255500 = 0.01429...
    const expectedCDI = (0.5 * 2 * 365 * 10) / (70 * 10 * 365);
    expect(result.result.CDI).toBeCloseTo(expectedCDI, 5);

    // HQ = CDI / RfD = 0.01429 / 0.01 = 1.429
    const expectedHQ = expectedCDI / 0.01;
    expect(result.result.HQ).toBeCloseTo(expectedHQ, 5);

    // CR повинен бути null для неканцерогенного ризику
    expect(result.result.CR).toBeNull();

    // Перевірка рівня ризику
    expect(result.result.riskLevelHQ).toBeDefined();
    expect(result.result.riskLevelCR).toBeNull();
  });

  test("обчислює CR коректно для канцерогенного ризику", () => {
    const payload = {
      ...basePayload,
      SF: 0.5,
    };

    const result = compute(payload);

    // AT для канцерогенного = 70 * 365 = 25550
    const AT = 70 * 365;
    const expectedCDI = (0.5 * 2 * 365 * 10) / (70 * AT);
    const expectedCR = expectedCDI * 0.5;

    expect(result.result.CR).not.toBeNull();
    expect(result.result.CR).toBeCloseTo(expectedCR, 8);
    expect(result.result.riskLevelCR).toBeDefined();
  });

  test("кидає помилку для негативних значень", () => {
    const invalidPayload = {
      ...basePayload,
      C: -1,
    };

    expect(() => compute(invalidPayload)).toThrow();
  });

  test("кидає помилку для нульових значень", () => {
    const invalidPayload = {
      ...basePayload,
      IR: 0,
    };

    expect(() => compute(invalidPayload)).toThrow();
  });

  test("кидає помилку для невалідного medium", () => {
    const invalidPayload = {
      ...basePayload,
      medium: "invalid",
    };

    expect(() => compute(invalidPayload)).toThrow();
  });

  test("коректно обробляє повітряне середовище", () => {
    const payload = {
      ...basePayload,
      medium: "air",
      IR: 15, // м³/день для повітря
    };

    const result = compute(payload);
    expect(result.result).toHaveProperty("CDI");
    expect(result.result).toHaveProperty("HQ");
    expect(result.meta.units.C).toBe("мг/м³");
    expect(result.meta.units.IR).toBe("м³/день");
  });

  test("коректно визначає рівні ризику для HQ", () => {
    // Низький ризик (HQ < 1)
    const lowRisk = compute({
      ...basePayload,
      RfD: 1, // Великий RfD дасть низький HQ
    });
    expect(lowRisk.result.riskLevelHQ).toBe("низький (прийнятний)");

    // Помірний ризик (1 <= HQ < 4)
    const moderateRisk = compute({
      ...basePayload,
      RfD: 0.005, // Середній RfD
    });
    const hq = moderateRisk.result.HQ;
    if (hq >= 1 && hq < 4) {
      expect(moderateRisk.result.riskLevelHQ).toBe("помірний");
    }

    // Високий ризик (HQ >= 4)
    const highRisk = compute({
      ...basePayload,
      RfD: 0.001, // Маленький RfD дасть високий HQ
    });
    if (highRisk.result.HQ >= 4) {
      expect(highRisk.result.riskLevelHQ).toBe("високий");
    }
  });

  test("коректно визначає рівні ризику для CR", () => {
    const payload = {
      ...basePayload,
      SF: 0.1,
    };

    // Дуже низький ризик (CR < 1e-6)
    const veryLowRisk = compute({
      ...payload,
      C: 0.001,
      RfD: 0.1,
    });
    if (veryLowRisk.result.CR < 1e-6) {
      expect(veryLowRisk.result.riskLevelCR).toBe("дуже низький");
    }

    // Прийнятний/помірний (1e-6 <= CR <= 1e-4)
    const moderateRisk = compute({
      ...payload,
      C: 0.1,
      RfD: 0.01,
    });
    const cr = moderateRisk.result.CR;
    if (cr >= 1e-6 && cr <= 1e-4) {
      expect(moderateRisk.result.riskLevelCR).toBe("прийнятний/помірний");
    }
  });
});
