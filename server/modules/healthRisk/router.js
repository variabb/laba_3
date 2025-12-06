import express from "express";
import { compute } from "./compute.js";

const router = express.Router();

/**
 * POST /api/healthRisk/calc
 * Обчислює ризик для здоров'я населення
 */
router.post("/calc", (req, res) => {
  try {
    const payload = req.body;
    const result = compute(payload);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Помилка обчислення",
    });
  }
});

export default router;
