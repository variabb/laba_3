/**
 * API для обчислення ризику здоров'я
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Обчислює ризик для здоров'я населення
 * @param {Object} payload - Вхідні параметри
 * @returns {Promise<Object>} Результати обчислення
 */
export async function calcHealthRisk(payload) {
  const response = await fetch(`${API_BASE_URL}/api/healthRisk/calc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Помилка обчислення");
  }

  return response.json();
}
