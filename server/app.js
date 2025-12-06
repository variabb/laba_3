import express from "express";
import cors from "cors";
import healthRiskRouter from "./modules/healthRisk/router.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/healthRisk", healthRiskRouter);

// Базовий маршрут
app.get("/", (req, res) => {
  res.json({ message: "Health Risk Assessment API" });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
