import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calcHealthRisk } from "./api";
import { genSynthetic } from "./synthetic";
import ResultCard from "./ResultCard";

function Form() {
  const [formData, setFormData] = useState({
    medium: "water",
    C: "",
    IR: "",
    EF: "",
    ED: "",
    BW: "",
    RfD: "",
    SF: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаємо помилки та результати при зміні
    if (error) setError(null);
    if (result) setResult(null);
  };

  const handleGenerate = () => {
    const synthetic = genSynthetic();
    setFormData(synthetic);
    setError(null);
    setResult(null);
    toast.success("Синтетичні дані згенеровано!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Конвертуємо рядки в числа
      const payload = {
        medium: formData.medium,
        C: parseFloat(formData.C),
        IR: parseFloat(formData.IR),
        EF: parseInt(formData.EF),
        ED: parseInt(formData.ED),
        BW: parseFloat(formData.BW),
        RfD: parseFloat(formData.RfD),
        SF: formData.SF === "" ? 0 : parseFloat(formData.SF),
      };

      const response = await calcHealthRisk(payload);
      setResult(response);
      toast.success("Обчислення виконано успішно!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.message || "Помилка обчислення";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
        Оцінка ризику для здоров'я населення
      </h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ display: "grid", gap: "15px" }}>
          {/* Medium */}
          <div>
            <label
              htmlFor="medium"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Середовище:
            </label>
            <select
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            >
              <option value="water">Вода</option>
              <option value="air">Повітря</option>
            </select>
          </div>

          {/* C */}
          <div>
            <label
              htmlFor="C"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              C - Концентрація забруднювача (
              {formData.medium === "water" ? "мг/л" : "мг/м³"}):
            </label>
            <input
              type="number"
              id="C"
              name="C"
              value={formData.C}
              onChange={handleChange}
              step="0.001"
              min="0.001"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 0.001 - 5{" "}
              {formData.medium === "water" ? "мг/л" : "мг/м³"}
            </small>
          </div>

          {/* IR */}
          <div>
            <label
              htmlFor="IR"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              IR - Інтенсивність надходження (
              {formData.medium === "water" ? "л/день" : "м³/день"}):
            </label>
            <input
              type="number"
              id="IR"
              name="IR"
              value={formData.IR}
              onChange={handleChange}
              step="0.1"
              min="0.1"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон:{" "}
              {formData.medium === "water"
                ? "0.5 - 3 л/день"
                : "5 - 25 м³/день"}
            </small>
          </div>

          {/* EF */}
          <div>
            <label
              htmlFor="EF"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              EF - Частота впливу (днів/рік):
            </label>
            <input
              type="number"
              id="EF"
              name="EF"
              value={formData.EF}
              onChange={handleChange}
              min="1"
              max="365"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 30 - 365 днів/рік
            </small>
          </div>

          {/* ED */}
          <div>
            <label
              htmlFor="ED"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              ED - Тривалість впливу (років):
            </label>
            <input
              type="number"
              id="ED"
              name="ED"
              value={formData.ED}
              onChange={handleChange}
              min="1"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 1 - 30 років
            </small>
          </div>

          {/* BW */}
          <div>
            <label
              htmlFor="BW"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              BW - Маса тіла (кг):
            </label>
            <input
              type="number"
              id="BW"
              name="BW"
              value={formData.BW}
              onChange={handleChange}
              step="0.1"
              min="1"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 15 - 100 кг
            </small>
          </div>

          {/* RfD */}
          <div>
            <label
              htmlFor="RfD"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              RfD - Референтна доза (мг/(кг·день)):
            </label>
            <input
              type="number"
              id="RfD"
              name="RfD"
              value={formData.RfD}
              onChange={handleChange}
              step="0.0001"
              min="0.0001"
              required
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 0.0001 - 0.1 мг/(кг·день)
            </small>
          </div>

          {/* SF */}
          <div>
            <label
              htmlFor="SF"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              SF - Фактор канцерогенного ризику (мг/(кг·день))⁻¹ (0 для
              неканцерогенного):
            </label>
            <input
              type="number"
              id="SF"
              name="SF"
              value={formData.SF}
              onChange={handleChange}
              step="0.01"
              min="0"
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Діапазон: 0 (неканцерогенний) або 0.1 - 2 (мг/(кг·день))⁻¹
            </small>
          </div>
        </div>

        {/* Помилки */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "5px",
              color: "#c00",
            }}
          >
            <strong>Помилка:</strong> {error}
          </div>
        )}

        {/* Кнопки */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleGenerate}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Згенерувати синтетичні дані
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Обчислення..." : "Обчислити"}
          </button>
        </div>
      </form>

      {/* Результати */}
      {result && <ResultCard result={result} />}

      {/* Toast контейнер */}
      <ToastContainer />
    </div>
  );
}

export default Form;
