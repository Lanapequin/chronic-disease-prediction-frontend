"use client";
import { useState } from "react";
import { predict } from "@/lib/api";

export default function PatientForm() {
  const [form, setForm] = useState({
    age: "",
    glucose: "",
    blood_pressure: "",
    cholesterol: "",
    bmi: "",
    physical_activity: "",
  });


  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predict(form);
      setResult(data);
    } catch (err) {
      setError("Error al comunicarse con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Predicción del Modelo</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block font-medium capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Calculando..." : "Calcular probabilidad"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result !== null && (
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-lg">
          Probabilidad estimada:{" "}
          <strong>{(result.probability * 100).toFixed(2)}%</strong>
        </p>

        <p className="mt-2">
          Nivel de riesgo: <strong>{result.risk_level}</strong>
        </p>
      </div>
    )}

    </div>
  );
}
