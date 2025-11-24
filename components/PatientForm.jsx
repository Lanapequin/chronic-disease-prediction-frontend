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
    } catch {
      setError("Error al comunicarse con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Predicción de Enfermedad Crónica
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1 capitalize text-sm">
                {key.replace("_", " ")}
              </label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                required
              />
            </div>
          ))}

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:bg-blue-300"
            >
              {loading ? "Calculando..." : "Calcular probabilidad"}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600 mt-4 text-center font-medium text-sm">
            {error}
          </p>
        )}

        {result !== null && (
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-800 text-sm">
            <p>
              Probabilidad estimada:{" "}
              <strong className="text-blue-700 text-base">
                {(result.probability * 100).toFixed(2)}%
              </strong>
            </p>

            <p className="mt-1">
              Nivel de riesgo:{" "}
              <strong
                className={
                  result.risk_level.toLowerCase() === "high"
                    ? "text-red-600"
                    : result.risk_level.toLowerCase() === "medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {result.risk_level}
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
