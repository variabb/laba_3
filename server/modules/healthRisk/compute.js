/**
 * Обчислення ризику для здоров'я населення від забруднювача
 * Варіант 1: CDI, HQ, CR
 */

/**
 * Обчислює рівень ризику на основі вхідних параметрів
 * @param {Object} payload - Вхідні параметри
 * @param {number} payload.C - Концентрація забруднювача, мг/л (вода) або мг/м³ (повітря)
 * @param {number} payload.IR - Інтенсивність надходження, л/день (вода) або м³/день (повітря)
 * @param {number} payload.EF - Частота впливу, днів/рік
 * @param {number} payload.ED - Тривалість впливу, років
 * @param {number} payload.BW - Маса тіла, кг
 * @param {number} payload.AT - Час усереднення, днів (опціонально, обчислюється автоматично)
 * @param {number} payload.RfD - Референтна доза, мг/(кг·день)
 * @param {number} payload.SF - Фактор канцерогенного ризику, (мг/(кг·день))^-1 (може бути 0)
 * @param {string} payload.medium - "water" або "air"
 * @returns {Object} Результати обчислення
 */
export function compute(payload) {
  // Валідація вхідних параметрів
  const { C, IR, EF, ED, BW, AT: providedAT, RfD, SF = 0, medium } = payload;

  // Перевірка обов'язкових параметрів
  if (
    C === undefined ||
    IR === undefined ||
    EF === undefined ||
    ED === undefined ||
    BW === undefined ||
    RfD === undefined ||
    medium === undefined
  ) {
    throw new Error("Відсутні обов'язкові параметри");
  }

  // Валідація medium
  if (medium !== "water" && medium !== "air") {
    throw new Error('medium повинен бути "water" або "air"');
  }

  // Валідація числових параметрів (всі > 0, крім SF який може бути 0)
  const numericParams = { C, IR, EF, ED, BW, RfD };
  for (const [key, value] of Object.entries(numericParams)) {
    if (typeof value !== "number" || value <= 0 || !isFinite(value)) {
      throw new Error(`Параметр ${key} повинен бути додатнім числом`);
    }
  }

  // SF може бути 0 або додатнім числом
  if (typeof SF !== "number" || SF < 0 || !isFinite(SF)) {
    throw new Error("SF повинен бути невід'ємним числом");
  }

  // Обчислення AT (час усереднення)
  // Для неканцерогенного ризику: AT = ED * 365
  // Для канцерогенного ризику: AT = 70 * 365
  const isCarcinogenic = SF > 0;
  const AT =
    providedAT !== undefined
      ? providedAT
      : isCarcinogenic
      ? 70 * 365
      : ED * 365;

  if (AT <= 0 || !isFinite(AT)) {
    throw new Error("AT повинен бути додатнім числом");
  }

  // Обчислення CDI (Chronic Daily Intake)
  // CDI = (C * IR * EF * ED) / (BW * AT)
  const CDI = (C * IR * EF * ED) / (BW * AT);

  // Обчислення HQ (Hazard Quotient)
  // HQ = CDI / RfD
  const HQ = CDI / RfD;

  // Обчислення CR (Cancer Risk), якщо SF > 0
  // CR = CDI * SF
  const CR = isCarcinogenic ? CDI * SF : null;

  // Визначення рівня ризику для HQ
  let riskLevelHQ;
  if (HQ < 1) {
    riskLevelHQ = "низький (прийнятний)";
  } else if (HQ < 4) {
    riskLevelHQ = "помірний";
  } else {
    riskLevelHQ = "високий";
  }

  // Визначення рівня ризику для CR
  let riskLevelCR = null;
  if (CR !== null) {
    if (CR < 1e-6) {
      riskLevelCR = "дуже низький";
    } else if (CR <= 1e-4) {
      riskLevelCR = "прийнятний/помірний";
    } else {
      riskLevelCR = "високий";
    }
  }

  // Формування метаданих
  const units = {
    C: medium === "water" ? "мг/л" : "мг/м³",
    IR: medium === "water" ? "л/день" : "м³/день",
    CDI: "мг/(кг·день)",
    HQ: "безрозмірна",
    CR: CR !== null ? "безрозмірна" : null,
  };

  const notes = [
    `Середовище: ${medium === "water" ? "вода" : "повітря"}`,
    `Тип ризику: ${isCarcinogenic ? "канцерогенний" : "неканцерогенний"}`,
    `Час усереднення (AT): ${AT.toFixed(0)} днів`,
  ];

  return {
    inputsNormalized: {
      C,
      IR,
      EF,
      ED,
      BW,
      AT,
      RfD,
      SF,
      medium,
    },
    result: {
      CDI,
      HQ,
      CR,
      riskLevelHQ,
      riskLevelCR,
    },
    meta: {
      units,
      notes,
    },
  };
}
