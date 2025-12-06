/**
 * Генерація синтетичних даних для тестування
 */

/**
 * Генерує випадкове число в діапазоні [min, max]
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Генерує випадкове ціле число в діапазоні [min, max]
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Генерує синтетичні дані для обчислення ризику
 * @returns {Object} Синтетичні дані
 */
export function genSynthetic() {
  const medium = Math.random() < 0.5 ? "water" : "air";

  // C: 0.001–5
  const C = randomFloat(0.001, 5);

  // IR: water: 0.5–3 (л/день), air: 5–25 (м³/день)
  const IR = medium === "water" ? randomFloat(0.5, 3) : randomFloat(5, 25);

  // EF: 30–365
  const EF = randomInt(30, 365);

  // ED: 1–30
  const ED = randomInt(1, 30);

  // BW: 15–100
  const BW = randomFloat(15, 100);

  // RfD: 0.0001–0.1
  const RfD = randomFloat(0.0001, 0.1);

  // SF: 0 або 0.1–2
  const SF = Math.random() < 0.3 ? 0 : randomFloat(0.1, 2);

  return {
    C: Math.round(C * 1000) / 1000, // Округлення до 3 знаків
    IR: Math.round(IR * 100) / 100, // Округлення до 2 знаків
    EF,
    ED,
    BW: Math.round(BW * 10) / 10, // Округлення до 1 знака
    RfD: Math.round(RfD * 10000) / 10000, // Округлення до 4 знаків
    SF: SF === 0 ? 0 : Math.round(SF * 100) / 100, // Округлення до 2 знаків
    medium,
  };
}
