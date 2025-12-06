import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ResultCard({ result }) {
  const { inputsNormalized, result: calcResult, meta } = result;

  const getRiskColor = (level) => {
    if (level?.includes("низький") || level?.includes("прийнятний")) {
      return "#28a745";
    } else if (level?.includes("помірний")) {
      return "#ffc107";
    } else if (level?.includes("високий")) {
      return "#dc3545";
    }
    return "#6c757d";
  };

  const formatNumber = (num, decimals = 6) => {
    if (num === null || num === undefined) return "N/A";
    if (num < 0.0001) {
      return num.toExponential(3);
    }
    return num.toFixed(decimals);
  };

  // Підготовка даних для графіка
  const chartData = [
    {
      name: "CDI",
      value: calcResult.CDI,
      label: "Chronic Daily Intake",
    },
    {
      name: "HQ",
      value: calcResult.HQ,
      label: "Hazard Quotient",
    },
  ];

  if (calcResult.CR !== null) {
    chartData.push({
      name: "CR",
      value: calcResult.CR,
      label: "Cancer Risk",
    });
  }

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "25px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
        Результати обчислення
      </h2>

      {/* Вхідні параметри */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#555" }}>
          Вхідні параметри:
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>C:</strong> {inputsNormalized.C} {meta.units.C}
          </div>
          <div>
            <strong>IR:</strong> {inputsNormalized.IR} {meta.units.IR}
          </div>
          <div>
            <strong>EF:</strong> {inputsNormalized.EF} днів/рік
          </div>
          <div>
            <strong>ED:</strong> {inputsNormalized.ED} років
          </div>
          <div>
            <strong>BW:</strong> {inputsNormalized.BW} кг
          </div>
          <div>
            <strong>RfD:</strong> {formatNumber(inputsNormalized.RfD, 4)}{" "}
            мг/(кг·день)
          </div>
          <div>
            <strong>SF:</strong>{" "}
            {inputsNormalized.SF === 0
              ? "0 (неканцерогенний)"
              : formatNumber(inputsNormalized.SF, 2)}
          </div>
          <div>
            <strong>AT:</strong> {Math.round(inputsNormalized.AT)} днів
          </div>
        </div>
      </div>

      {/* Результати обчислення */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#555" }}>
          Результати:
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {/* CDI */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "5px",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              CDI (Chronic Daily Intake)
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {formatNumber(calcResult.CDI)}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
              {meta.units.CDI}
            </div>
          </div>

          {/* HQ */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "5px",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              HQ (Hazard Quotient)
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              {formatNumber(calcResult.HQ)}
            </div>
            <div
              style={{
                fontSize: "14px",
                marginTop: "8px",
                padding: "5px 10px",
                backgroundColor: getRiskColor(calcResult.riskLevelHQ),
                color: "white",
                borderRadius: "3px",
                display: "inline-block",
              }}
            >
              {calcResult.riskLevelHQ}
            </div>
          </div>

          {/* CR */}
          {calcResult.CR !== null && (
            <div
              style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "5px",
                border: "1px solid #dee2e6",
              }}
            >
              <div
                style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
              >
                CR (Cancer Risk)
              </div>
              <div
                style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
              >
                {formatNumber(calcResult.CR)}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  marginTop: "8px",
                  padding: "5px 10px",
                  backgroundColor: getRiskColor(calcResult.riskLevelCR),
                  color: "white",
                  borderRadius: "3px",
                  display: "inline-block",
                }}
              >
                {calcResult.riskLevelCR}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Графік результатів */}
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#555" }}>
          Візуалізація результатів:
        </h3>
        <div
          style={{
            padding: "15px",
            backgroundColor: "white",
            borderRadius: "5px",
            border: "1px solid #dee2e6",
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Параметр",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Значення",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => formatNumber(value, 6)}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.name === label);
                  return item ? item.label : label;
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill="#007bff"
                name="Значення"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Інтерпретація */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#e7f3ff",
          borderRadius: "5px",
          border: "1px solid #b3d9ff",
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#004085" }}>
          Інтерпретація результатів:
        </h4>
        <div style={{ fontSize: "14px", color: "#004085", lineHeight: "1.6" }}>
          <p style={{ margin: "5px 0" }}>
            <strong>HQ (Hazard Quotient):</strong> {calcResult.riskLevelHQ}.
            {calcResult.HQ < 1
              ? " Ризик прийнятний, вплив забруднювача не становить загрози для здоров'я."
              : calcResult.HQ < 4
              ? " Ризик помірний, рекомендовано моніторинг та додаткові дослідження."
              : " Ризик високий, необхідні заходи зі зменшення впливу забруднювача."}
          </p>
          {calcResult.CR !== null && (
            <p style={{ margin: "5px 0" }}>
              <strong>CR (Cancer Risk):</strong> {calcResult.riskLevelCR}.
              {calcResult.CR < 1e-6
                ? " Канцерогенний ризик дуже низький."
                : calcResult.CR <= 1e-4
                ? " Канцерогенний ризик в межах прийнятного діапазону."
                : " Канцерогенний ризик високий, необхідні негайні заходи."}
            </p>
          )}
        </div>
      </div>

      {/* Метадані */}
      {meta.notes && meta.notes.length > 0 && (
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
          <strong>Примітки:</strong>
          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
            {meta.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
